export type HintType = "GREEN" | "YELLOW" | "NONE";

let wordleWords: string[] | null = null;

export const loadWords = async (): Promise<string[]> => {
  if (wordleWords !== null) {
    return wordleWords;
  }

  return fetch("/words.json")
    .then((response) => response.json())
    .then((words: string[]) => {
      wordleWords = words;
      return words;
    });
};

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
const reduceHints = (guesses: Guess[]) => {
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

export const getPossibleWords = (words: string[], guesses: Guess[]): string[] => {
  if (guesses.length === 0) {
    return [];
  }

  const { hints, exclusions } = reduceHints(guesses);

  // Count required occurrences of each letter based on the maximum count
  // of yellow/green hints for that letter across all guesses
  const letterCounts = new Map<string, number>();
  guesses.forEach((guess) => {
    const guessLetterCounts = new Map<string, number>();
    guess.hints.forEach((hint) => {
      if (hint.type !== "NONE") {
        const letter = hint.letter.toLowerCase();
        guessLetterCounts.set(letter, (guessLetterCounts.get(letter) || 0) + 1);
      }
    });

    // Update letterCounts with the maximum seen for each letter
    guessLetterCounts.forEach((count, letter) => {
      letterCounts.set(letter, Math.max(letterCounts.get(letter) || 0, count));
    });
  });

  const matchedWords = words.filter((word) => {
    const chars = word.split("");

    // First, verify all GREEN hints match exactly
    const greensMatch = hints.every((hint) => {
      if (hint.type == "GREEN") {
        return chars[hint.position] == hint.letter.toLowerCase();
      }
      return true;
    });

    if (!greensMatch) {
      return false;
    }

    // Verify word has enough occurrences of each letter
    for (const [letter, requiredCount] of letterCounts.entries()) {
      const actualCount = chars.filter((c) => c === letter).length;
      if (actualCount < requiredCount) {
        return false;
      }
    }

    // Verify all YELLOW hints: letter must NOT be at the hint position
    const yellowsMatch = hints.every((hint) => {
      if (hint.type == "YELLOW") {
        const letter = hint.letter.toLowerCase();
        // Letter must not be at this position
        if (chars[hint.position] === letter) {
          return false;
        }
      }
      return true;
    });

    if (!yellowsMatch) {
      return false;
    }

    const containsExclusion = exclusions.some((letter) => word.includes(letter.toLowerCase()));

    return !containsExclusion && !isPlural(word);
  });

  const rankedWords = matchedWords
    .map((word) => ({ word, rank: getRank(word) }))
    .sort((a, b) => b.rank - a.rank);

  return rankedWords.map((ranked) => ranked.word);
};
