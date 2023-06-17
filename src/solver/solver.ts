import { wordleWords } from "./words";

type HintType = "GREEN" | "YELLOW" | "NONE";

interface Hint {
  letter: string;
  position: number;
  type: HintType;
}

export const getPossibleWords = (hints: Hint[], exclusions: string[]) => {
  return wordleWords.filter((word) => {
    for (const hint of hints) {
      if (hint.type == "GREEN") {
        if (word.charAt(hint.position) != hint.letter) {
          return false;
        }
      }

      if (hint.type == "YELLOW") {
        if (!word.includes(hint.letter)) {
          return false;
        }

        if (word.charAt(hint.position) == hint.letter) {
          return false;
        }

        // TODO also make sure letter isn't at any green positions
      }
    }

    if (exclusions.some((letter) => word.includes(letter))) {
      return false;
    }

    return true;
  });
};
