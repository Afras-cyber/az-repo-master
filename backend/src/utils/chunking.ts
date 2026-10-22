export interface TextChunk {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  text: string;
}

const CHUNK_LINES = 80;
const OVERLAP_LINES = 12;

export function chunkFiles(
  files: Array<{ path: string; content: string }>,
  makeId: (filePath: string, startLine: number) => string,
): TextChunk[] {
  const chunks: TextChunk[] = [];

  for (const file of files) {
    const lines = file.content.replace(/\r\n/g, "\n").split("\n");

    for (let offset = 0; offset < lines.length; offset += CHUNK_LINES - OVERLAP_LINES) {
      const chunkLines = lines.slice(offset, offset + CHUNK_LINES);
      if (chunkLines.every((line) => line.trim().length === 0)) continue;

      const startLine = offset + 1;
      chunks.push({
        id: makeId(file.path, startLine),
        filePath: file.path,
        startLine,
        endLine: offset + chunkLines.length,
        text: chunkLines
          .map((line, index) => `${startLine + index}: ${line}`)
          .join("\n"),
      });

      if (offset + CHUNK_LINES >= lines.length) break;
    }
  }

  return chunks;
}
