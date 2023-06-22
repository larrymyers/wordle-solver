import { wordleWords } from "./words";

export type HintType = "GREEN" | "YELLOW" | "NONE";

export interface Hint {
  letter: string;
  position: number;
  type: HintType;
}

export const getPossibleWords = (hints: Hint[], exclusions: string[]) => {
  return wordleWords.filter((word) => {
    const containsHint = hints.every((hint) => {
      const letter = hint.letter.toLowerCase();

      if (hint.type == "GREEN") {
        if (word.charAt(hint.position) == letter) {
          return true;
        }
      }

      if (hint.type == "YELLOW") {
        if (word.includes(letter)) {
          return true;
        }

        if (word.charAt(hint.position) == letter) {
          return false;
        }

        // TODO also make sure letter isn't at any green positions
      }

      return false;
    });

    const containsExclusion = exclusions.some((letter) => word.includes(letter.toLowerCase()));

    return containsHint && !containsExclusion;
  });
};
