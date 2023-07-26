import { wordleWords } from "./words";

export type HintType = "GREEN" | "YELLOW" | "NONE";

export interface Hint {
  letter: string;
  position: number;
  type: HintType;
}

export interface Guess {
  hints: Hint[];
}

// reduceHints takes all current guesses and outputs two arrays:
// 1. The list of exact and partial matches.
// 2. The list of exclusions (letters that do not match)
export const reduceHints = (guesses: Guess[]) => {
  const hints = guesses.reduce<Hint[]>((hints, guess) => {
    hints = hints.concat(guess.hints.filter((hint) => hint.type != "NONE"));
    return hints;
  }, []);

  const exclusions = guesses.reduce<string[]>((letters, guess) => {
    letters = letters.concat(
      guess.hints.filter((hint) => hint.type == "NONE").map((hint) => hint.letter)
    );
    return letters;
  }, []);

  return { hints, exclusions };
};

export const getPossibleWords = (hints: Hint[], exclusions: string[]) => {
  const exactMatches = hints.reduce<number[]>((greens, hint) => {
    if (hint.type == "GREEN") {
      greens.push(hint.position);
    }

    return greens;
  }, []);

  return wordleWords.filter((word) => {
    const containsHint = hints.every((hint) => {
      const { type, position } = hint;
      const letter = hint.letter.toLowerCase();
      const chars = word.split("");

      if (type == "GREEN") {
        if (chars[position] == letter) {
          return true;
        }
      }

      if (type == "YELLOW") {
        return chars.some((c, i) => {
          // match can't be at an existing green hint position
          if (exactMatches.includes(i)) {
            return false;
          }

          // match must be at a position different than hint
          if (i == position) {
            return false;
          }

          return c == letter;
        });
      }

      return false;
    });

    const containsExclusion = exclusions.some((letter) => word.includes(letter.toLowerCase()));

    return containsHint && !containsExclusion;
  });
};
