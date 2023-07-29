import { assert, test } from "vitest";
import { Guess, getPossibleWords, reduceHints } from "./solver";

test("getPossibleWords", () => {
  const matches = getPossibleWords(
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

test("guesses with hint promotion", () => {
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

  const actualWords = getPossibleWords(hints, exclusions);
  const expectedWords = ["curly", "curvy"];

  expectedWords.forEach((word) => assert.include(actualWords, word));
});
