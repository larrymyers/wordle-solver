import { createReadStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

const wordStream = createReadStream("./words_alpha.txt");
const lineReader = createInterface({ input: wordStream });

let wordleWords = [];

for await (const line of lineReader) {
  const word = line.trim();

  if (word.length === 5) {
    wordleWords.push(word);
  }
}

const exclusions = [
  "aahed",
  "aalii",
  "aargh",
  "abaca",
  "abaci",
  "aback",
  "abada",
  "abaff",
  "abaft",
  "abaka",
  "abama",
  "abamp",
  "aband",
  "abaue",
  "abave",
  "abaze",
  "abbas",
  "abdal",
  "abdat",
  "abdom",
  "abeam",
  "abear",
  "abede",
  "abele",
  "abilo",
  "abime",
  "abysm",
  "teart",
  "peart",
];

wordleWords = wordleWords.filter((word) => !exclusions.includes(word));

const outModule = `
  export const wordleWords = ${JSON.stringify(wordleWords)};
`;

writeFileSync("./words.ts", outModule, "utf-8");
