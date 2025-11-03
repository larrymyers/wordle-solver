import { assert, test } from "vitest";
import { type Guess, getPossibleWords, reduceHints } from "./solver";

test("getPossibleWords", async () => {
  const matches = await getPossibleWords(
    [
      { letter: "r", position: 0, type: "GREEN" },
      { letter: "c", position: 3, type: "GREEN" },
      { letter: "h", position: 2, type: "YELLOW" },
      { letter: "h", position: 0, type: "YELLOW" },
    ],
    ["e", "m", "p", "l", "s", "t"]
  );

  console.log(matches);
});

test("guesses with hint promotion", async () => {
  const guesses: Guess[] = [
    {
      hints: [
        { letter: "R", position: 0, type: "YELLOW" },
        { letter: "A", position: 1, type: "NONE" },
        { letter: "C", position: 2, type: "YELLOW" },
        { letter: "E", position: 3, type: "NONE" },
        { letter: "S", position: 4, type: "NONE" },
      ],
    },
    {
      hints: [
        { letter: "C", position: 0, type: "GREEN" },
        { letter: "O", position: 1, type: "NONE" },
        { letter: "U", position: 2, type: "YELLOW" },
        { letter: "R", position: 3, type: "YELLOW" },
        { letter: "T", position: 4, type: "NONE" },
      ],
    },
  ];

  const { hints, exclusions } = reduceHints(guesses);

  const actualWords = await getPossibleWords(hints, exclusions);
  const expectedWords = ["curly", "curvy"];

  expectedWords.forEach((word) => assert.include(actualWords, word));
});

test("double letter guess with only a single match", async () => {
  const gueses: Guess[] = [
    {
      hints: [
        { letter: "F", position: 0, type: "NONE" },
        { letter: "O", position: 1, type: "GREEN" },
        { letter: "L", position: 2, type: "GREEN" },
        { letter: "L", position: 3, type: "NONE" },
        { letter: "Y", position: 4, type: "YELLOW" },
      ],
    },
  ];

  const { hints, exclusions } = reduceHints(gueses);

  const actualWords = await getPossibleWords(hints, exclusions);
  const expectedWords = ["polyp"];

  expectedWords.forEach((word) => assert.include(actualWords, word));
});
