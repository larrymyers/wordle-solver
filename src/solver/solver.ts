import { wordleWords } from "./words";

export type HintType = "GREEN" | "YELLOW" | "NONE";

export interface Hint {
  letter: string;
  position: number;
  type: HintType;
}

export const getPossibleWords = (hints: Hint[], exclusions: string[]) => {
  return wordleWords.filter((word) => {
    const containsHint = hints.some((hint) => {
      if (hint.type == "GREEN") {
        if (word.charAt(hint.position) == hint.letter) {
          return true;
        }
      }

      if (hint.type == "YELLOW") {
        if (word.includes(hint.letter)) {
          return true;
        }

        if (word.charAt(hint.position) == hint.letter) {
          return false;
        }

        // TODO also make sure letter isn't at any green positions
      }

      return false;
    });

    const containsExclusion = exclusions.some((letter) => word.includes(letter));

    return containsHint && !containsExclusion;
  });
};
