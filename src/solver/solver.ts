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
  const hintsByLetter = guesses.reduce<Map<string, Hint[]>>((hints, guess) => {
    guess.hints
      .filter((hint) => hint.type != "NONE")
      .sort((a, _) => (a.type == "GREEN" ? 1 : -1)) // eval exact matches first
      .forEach((hint) => {
        let letterHints = hints.get(hint.letter);
        if (letterHints) {
          // if letter is in the correct position remove previous partial matches
          if (hint.type == "GREEN") {
            letterHints = letterHints.filter((hint) => hint.type != "YELLOW");
          }
          letterHints.push(hint);
          hints.set(hint.letter, letterHints);
        } else {
          hints.set(hint.letter, [hint]);
        }
      });

    return hints;
  }, new Map());

  let hints: Hint[] = [];
  for (const letterHints of hintsByLetter.values()) {
    hints = hints.concat(letterHints);
  }

  const exclusions = guesses.reduce<string[]>((letters, guess) => {
    guess.hints
      .filter((hint) => hint.type == "NONE")
      .map((hint) => hint.letter)
      .forEach((letter) => {
        // handle a double letter guess where only a single letter matches
        if (hintsByLetter.has(letter)) {
          return;
        }

        letters.push(letter);
      });

    return letters;
  }, []);

  return { hints, exclusions };
};

const getRank = (word: string) => {
  const primary = ["r", "s", "t", "l", "n", "e", "a"];
  const secondary = ["i", "o", "u", "m", "p", "d", "c"];
  let score = 0;

  primary.forEach((c) => {
    if (word.includes(c)) {
      score += 10;
    }
  });

  secondary.forEach((c) => {
    if (word.includes(c)) {
      score += 5;
    }
  });

  return score;
};

const isPlural = (word: string) => {
  const chars = word.split("");

  if (word[4] != "s") {
    return false;
  }

  // i.e. guess, class, minus, focus
  if (["a", "i", "o", "u", "s"].includes(word[3])) {
    return false;
  }

  return true;
};

export const getPossibleWords = (hints: Hint[], exclusions: string[]) => {
  const exactMatches = hints.reduce<number[]>((greens, hint) => {
    if (hint.type == "GREEN") {
      greens.push(hint.position);
    }

    return greens;
  }, []);

  const matchedWords = wordleWords.filter((word) => {
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

    return containsHint && !containsExclusion && !isPlural(word);
  });

  const rankedWords = matchedWords
    .map((word) => ({ word, rank: getRank(word) }))
    .sort((a, b) => b.rank - a.rank);

  return rankedWords.map((ranked) => ranked.word);
};
