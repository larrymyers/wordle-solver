import { wordleWords } from "./words";

type Hint = "GREEN" | "YELLOW" | "EXCLUDE";

interface Character {
  letter: string;
  hint: Hint;
}

export const getPossibleWords = (guess: Character[]) => {
  const guessWord = guess
    .map((g) => g.letter)
    .join("")
    .toLowerCase();

  return wordleWords.filter((word) => {
    if (word == guessWord) {
      return false;
    }

    for (let i = 0; i < guess.length; i++) {
      const c = guess[i];

      if (c.hint == "GREEN") {
        if (word.charAt(i) != c.letter) {
          return false;
        }
      }

      if (c.hint == "YELLOW") {
        if (!word.includes(c.letter)) {
          return false;
        }
      }

      if (c.hint == "EXCLUDE") {
        if (word.includes(c.letter)) {
          return false;
        }
      }
    }

    return true;
  });
};
