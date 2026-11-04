// Oracle for reading-time-browser. Invariants:
// 1. A blog post page loads in a real browser with no page errors (no `process is not defined`
//    from the util polyfill reading-time used to drag in), and shows "N min read" with N > 0.
// 2. In Node, reading-time still works, including `readingTimeStream` (pre-existing API).
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.env.GRAFT_PROJECT_ROOT ?? process.cwd();
const require = createRequire(path.join(root, 'package.json'));
const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

// 2. Node API, unchanged.
const readingTime = require('reading-time');
const r = readingTime('word '.repeat(400));
if (Math.round(r.minutes) !== 2 || r.words !== 400) fail(`readingTime() changed: ${JSON.stringify(r)}`);
if (typeof readingTime.readingTimeStream !== 'function') fail('readingTimeStream is missing in Node');
const stream = readingTime.readingTimeStream();
await new Promise((resolve, reject) => {
  stream.on('data', (s) => (s.words === 3 ? resolve() : reject(new Error(`stream counted ${s.words} words`))));
  stream.on('error', reject);
  stream.end('one two three');
}).catch((e) => fail(`readingTimeStream: ${e.message}`));
console.log('✓ reading-time works in Node (readingTime and readingTimeStream)');

// 1. The site in a browser: the dev server (mode "dev") or the prerendered build (mode "build").
const mode = process.env.GRAFT_MODE ?? process.argv[2] ?? 'build';
if (mode === 'dev') await devCheck();
else await buildCheck();

async function devCheck() {
  const { spawn } = await import('node:child_process');
  const port = await new Promise((resolve) => {
    const s = createServer().listen(0, () => {
      const p = s.address().port;
      s.close(() => resolve(p));
    });
  });
  // vite's own bin, not npx, so the process we stop is the server itself.
  const viteBin = path.join(root, 'node_modules/vite/bin/vite.js');
  const vite = spawn(process.execPath, [viteBin, '--port', String(port), '--strictPort', '--force'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], detached: true });
  const stop = () => {
    for (const target of [-vite.pid, vite.pid]) {
      try { process.kill(target, 'SIGKILL'); } catch {}
    }
  };
  process.on('exit', stop); // fail() exits without running finally blocks
  let log = '';
  vite.stdout.on('data', (d) => (log += d));
  vite.stderr.on('data', (d) => (log += d));
  try {
    for (let i = 0; i < 120 && !/Local:/.test(log); i++) await new Promise((r) => setTimeout(r, 500));
    if (!/Local:/.test(log)) fail(`dev server did not start:\n${log.slice(-2000)}`);
    // Analog's dev SSR is not needed (and slow to warm up): load reading-time the way the dev
    // server serves it to the browser, through a one-line module, and call it there.
    const { chromium } = createRequire(import.meta.url)('playwright');
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`http://localhost:${port}/favicon.ico`);
      const entry = path.join(path.dirname(new URL(import.meta.url).pathname), 'browser-entry.mjs');
      const minutes = await page
        .evaluate(async (url) => {
          const { default: readingTime } = await import(url);
          return readingTime('word '.repeat(400)).minutes;
        }, `/@fs${entry}`)
        .catch((e) => fail(`[dev] loading reading-time in the browser failed: ${e.message.split('\n')[0]}`));
      if (errors.length) fail(`[dev] page errors: ${errors.join(' | ')}`);
      if (Math.round(minutes) !== 2) fail(`[dev] readingTime() in the browser returned ${minutes} minutes`);
      console.log('✓ [dev] reading-time loads and works in the browser from the dev server');
    } finally {
      await browser.close();
    }
  } finally {
    stop();
  }
}

async function visit(url, slug) {
  const { chromium } = createRequire(import.meta.url)('playwright');
  const browser = await chromium.launch();
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push(e.message));
    // Angular's ErrorHandler catches errors and logs them instead of throwing.
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().split('\n')[0]));
    page.on('response', (r) => r.status() >= 500 && errors.push(`HTTP ${r.status()} ${new URL(r.url()).pathname}`));
    await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
    await page.waitForTimeout(1000);
    const text = await page.locator('body').innerText();
    const m = /(\d+) min read/.exec(text);
    if (errors.length) fail(`[${mode}] page errors on /blog/posts/${slug}: ${[...new Set(errors)].slice(0, 5).join(' | ')}`);
    if (!m || Number(m[1]) < 1) fail(`[${mode}] no "N min read" on /blog/posts/${slug}: ${text.slice(0, 300).replace(/\s+/g, ' ')}`);
    console.log(`✓ [${mode}] /blog/posts/${slug} loads without errors and shows "${m[0]}"`);
  } finally {
    await browser.close();
  }
}

async function buildCheck() {
execSync('npx vite build', { cwd: root, stdio: 'ignore' });
const pub = path.join(root, 'dist/analog/public');
const posts = path.join(pub, 'blog/posts');
const slug = readdirSync(posts).find((d) => statSync(path.join(posts, d)).isDirectory());
if (!slug) fail('no prerendered post found');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  let file = path.join(pub, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!existsSync(file)) file = path.join(pub, 'index.html');
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
}).listen(0);
const port = server.address().port;
try {
  await visit(`http://localhost:${port}/blog/posts/${slug}`, slug);
} finally {
  server.close();
}
}
