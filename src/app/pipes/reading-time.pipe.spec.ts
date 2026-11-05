import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { ReadingTimePipe } from './reading-time.pipe';

// Covers the Invariants of the reading-time-browser graft (.grafts/reading-time-browser).
describe('ReadingTimePipe / reading-time', () => {
  it('shows minutes of reading time', () => {
    const pipe = new ReadingTimePipe();
    expect(pipe.transform('word '.repeat(400))).toBe(2);
    expect(pipe.transform(undefined)).toBe(0);
  });

  it("doesn't load reading-time's stream API (and Node's stream/util) until it is used", () => {
    // Loading it eagerly is what pulled the util polyfill, and `process is not defined`, into the
    // browser. Checked in a plain Node process: test-runner interop can touch every export.
    const loaded = (code: string) =>
      execFileSync(process.execPath, ['-e', `${code}; process.stdout.write(String(!!require.cache[require.resolve('reading-time/lib/stream')]))`], {
        encoding: 'utf8',
      });
    expect(loaded("require('reading-time')('one two three')")).toBe('false');
    // The stream API itself still works for anyone who uses it.
    expect(loaded("require('reading-time').readingTimeStream()")).toBe('true');
  });
});
