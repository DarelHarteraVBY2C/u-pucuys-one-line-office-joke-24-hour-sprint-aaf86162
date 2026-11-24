// make.fun entry — "One-Line Office Joke: 24-Hour Sprint"
// --------------------------------------------------------
// main.ts (Node 22, no dependencies, no network) writes one
// single-line joke about office life to /output/entry.txt.
//
// The joke, against the judge's brief in its own order:
//   1. One-line office joke — a printer gag, a setup and a
//      punchline in a single sentence, nothing else.
//   2. Funny — the payoff flips the premise: a jam is not bad
//      luck, it is proof the machine is reading the queue.
//   3. One line — one sentence, no rambling around it.
//   4. Fresh — not the tired "meeting that should have been an
//      email"; a specific, concrete office object misbehaving
//      with suspicious timing.
//   5. Clear on first read — plain words, no reference the
//      reader cannot follow.
//
// The program is deterministic: the same text on every run.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const JOKE: string =
  "The office printer only jams when the document is urgent, which is how I know it can read.";

function buildEntry(): string {
  return JOKE;
}

function guardLength(text: string): void {
  const points = [...text].length;
  if (points < 1 || points > 200) {
    throw new Error(`entry must be 1-200 characters, got ${points}`);
  }
  // The gate counts characters, but an exact tie on win rate falls to
  // the smaller text in bytes, so keep the UTF-8 size in view too.
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > 200) {
    throw new Error(`entry must be at most 200 bytes, got ${bytes}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

// The sandbox hands the text to a sealed gate and then to the judge, so
// a silent short write would fail the entry without a trace. Write the
// file, read it back, and refuse to finish unless the bytes on disk are
// exactly the text we meant to send.
function writeEntry(text: string): void {
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", text, "utf8");
  const roundTripped = readFileSync("/output/entry.txt", "utf8");
  if (roundTripped !== text) {
    throw new Error("entry.txt did not round-trip");
  }
}

function main(): void {
  const entry = buildEntry();
  guardLength(entry);
  writeEntry(entry);
}

main();
