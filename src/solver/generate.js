import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const wordStream = createReadStream("./words_alpha.txt");
const lineReader = createInterface({ input: wordStream });

const wordleWords = [];

for await (const line of lineReader) {
  const word = line.trim();

  if (word.length === 5) {
    wordleWords.push(word);
  }
}

const outModule = `
  export const wordleWords = ${JSON.stringify(wordleWords)};
`;

writeFileSync("./words.ts", outModule, "utf-8");
