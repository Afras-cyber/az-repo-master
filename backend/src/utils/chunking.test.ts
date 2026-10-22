import assert from "node:assert/strict";
import test from "node:test";
import { chunkFiles } from "./chunking.js";

test("chunkFiles preserves line numbers and overlaps adjacent chunks", () => {
  const content = Array.from({ length: 81 }, (_, index) => `line ${index + 1}`).join(
    "\n",
  );
  const chunks = chunkFiles([{ path: "src/index.ts", content }], (path, line) =>
    `${path}:${line}`,
  );

  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].startLine, 1);
  assert.equal(chunks[0].endLine, 80);
  assert.equal(chunks[1].startLine, 69);
  assert.equal(chunks[1].endLine, 81);
  assert.match(chunks[1].text, /^69: line 69/);
});

test("chunkFiles skips empty chunks", () => {
  const chunks = chunkFiles([{ path: "empty.ts", content: " \n\n" }], () => "id");

  assert.deepEqual(chunks, []);
});
