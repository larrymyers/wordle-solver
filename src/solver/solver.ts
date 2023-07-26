import { wordleWords } from "./words";

export type HintType = "GREEN" | "YELLOW" | "NONE";

export interface Hint {
  letter: string;
  position: number;
  type: HintType;
}

export const getPossibleWords = (hints: Hint[], exclusions: string[]) => {
  // const exactMatches = hints.reduce<number[]>((greens, hint) => {
  //   if (hint.type == "GREEN") {
  //     greens.push(hint.position);
  //   }

  //   return greens;
  // }, []);

  return wordleWords.filter((word) => {
    const containsHint = hints.every((hint) => {
      const letter = hint.letter.toLowerCase();

      if (hint.type == "GREEN") {
        if (word.charAt(hint.position) == letter) {
          return true;
        }
      }

      if (hint.type == "YELLOW") {
        // exclude words that have a letter that matches the hint letter and position
        // i.e. that would be a green hint, not a yellow hint
        if (word.charAt(hint.position) == letter) {
          return false;
        }

        // TODO this could be more exact. The word should contain the letter at a position
        // that isn't already claimed by a green hint. Does this eliminate double letter words incorrectly?
        if (word.includes(letter)) {
          return true;
        }
      }

      return false;
    });

    const containsExclusion = exclusions.some((letter) => word.includes(letter.toLowerCase()));

    return containsHint && !containsExclusion;
  });
};
