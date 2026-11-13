---
id: reading-time-browser
rootstock:
  package: reading-time
  verified: 1.5.0
mechanism: patch
targets:
  - index.js
variants:
  - range: ">=1.0.0-0"
    module: ./variants/v1.patch
status: applied
---

## Why

The blog shows "N min read" on every post with `reading-time`'s default `readingTime()`.
`reading-time`'s entry point also loads its stream API eagerly, and with it Node's `stream` and
`util`. In the browser those resolve to polyfills, and the `util` polyfill reads
`process.env.NODE_DEBUG` the moment it loads. `process` doesn't exist in the browser, so loading
`reading-time` client-side throws `ReferenceError: process is not defined`.

It used to be patched over in `vite.config.ts` with `define: { 'process.env.NODE_DEBUG': … }`.
That stopped working in dev with Vite 8, whose dependency pre-bundler doesn't apply `define` to
dependencies. Production builds never needed it, because Vite already replaces `process.env`
there. This graft fixes the cause instead: the stream API loads only when used. The blog never
uses it.

Upstream: https://github.com/ngryman/reading-time (the stream export is part of its public API,
so a lazy getter keeps it working for Node users).

## Invariants

Covered by `src/app/pipes/reading-time.pipe.spec.ts` (`npm test`):

- Loading `reading-time` and calling `readingTime()` doesn't load its stream API, and so
  doesn't pull Node's `stream`/`util` polyfills (and `process is not defined`) into the browser.
- `readingTime()` still gives the same result (400 words read as 2 minutes), so posts show the
  same "N min read".
- `readingTimeStream` still works for anyone who uses it (it loads on first use).

## Where to look

`reading-time`'s package entry point: the module that re-exports the reading-time function as
both the CommonJS export and `default`, and attaches the stream API (`readingTimeStream`) to it.
The stream implementation itself (a `Transform` built with Node's `stream` and `util`) is what
must not load unless `readingTimeStream` is accessed.

## Anchors

One hunk, on the entry point's line that assigns `readingTimeStream` by requiring the stream
module. It's the exact place the eager `require` happens. If upstream restructures the entry
point (e.g. ships ESM, or splits the stream API into its own entry), the anchor misses, and the
graft may be unnecessary: check whether loading the package still pulls in `stream`/`util`.

## History

- 2026-11-04: Graft created against reading-time@1.5.0, replacing the
  `process.env.NODE_DEBUG` define in `vite.config.ts`. Verified by hand: the dev server and a
  prerendered post load in Chromium without `process is not defined`; the Invariants are now
  covered by `reading-time.pipe.spec.ts`.
