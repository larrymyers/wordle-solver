import { test } from "vitest";
import { getPossibleWords } from "./solver";

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
