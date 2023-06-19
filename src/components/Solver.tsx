import { useState } from "preact/hooks";
import { getPossibleWords, HintType, type Hint } from "../solver/solver";

interface Guess {
  hints: Hint[];
}

interface SolverState {
  guesses: Guess[];
  wordList: string[];
}

export const Solver = () => {
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const addGuess = (guess: Guess) => {
    setGuesses(guesses.concat([guess]));
  };

  const reducedHints = reduceHints(guesses);

  let wordList: string[] = [];
  if (reducedHints.hints.length > 0 || reducedHints.exclusions.length > 0) {
    wordList = getPossibleWords(reducedHints.hints, reducedHints.exclusions);
  }

  return (
    <div class="flex flex-row">
      <div class="basis-1/2">
        <h2>Guesses</h2>
        {guesses.map((guess) => (
          <PreviousGuess guess={guess} />
        ))}
        <GuessInput onSubmit={addGuess} />
      </div>
      <div class="basis-1/2">
        <h2>Possible Words ({wordList.length})</h2>
        {wordList.map((word) => (
          <div>{word}</div>
        ))}
      </div>
    </div>
  );
};

const reduceHints = (guesses: Guess[]) => {
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

const getWord = (guess: Guess) => guess.hints.map((hint) => hint.letter).join("");

export const PreviousGuess = ({ guess }: { guess: Guess }) => {
  const word = getWord(guess);

  if (word.length < 5) {
    return <></>;
  }

  return <div>{word}</div>;
};

interface HintInputProps {
  hint: Hint;
  onChange: (hint: Hint) => void;
}

const HintInput = ({ hint, onChange }: HintInputProps) => {
  const [letter, setLetter] = useState(hint.letter.toUpperCase());

  const setType = (type: HintType) => {
    hint.type = type;
  };

  return (
    <div class="relative inline-block">
      <input
        class="w-10 h-12 p-2 mx-2 border-2 border-slate-800 focus:border-blue-500 text-2xl"
        value={letter}
        onFocus={() => {}}
        onInput={(evt) => {
          const nextLetter = (evt.target as HTMLInputElement).value;
          setLetter(nextLetter.toUpperCase());
        }}
        onBlur={() => {
          hint.letter = letter;
          onChange(hint);
        }}
        type="text"
        maxLength={1}
      />
      <div class="absolute top-3 left-0">
        <button>{letter}</button>
        <button>{letter}</button>
      </div>
    </div>
  );
};

const emptyHints = (): Record<number, Hint> => {
  return {
    0: { letter: "", position: 0, type: "NONE" },
    1: { letter: "", position: 1, type: "NONE" },
    2: { letter: "", position: 2, type: "NONE" },
    3: { letter: "", position: 3, type: "NONE" },
    4: { letter: "", position: 4, type: "NONE" },
  };
};

interface GuessInputProps {
  onSubmit: (guess: Guess) => void;
}

export const GuessInput = ({ onSubmit }: GuessInputProps) => {
  const [hints, setHints] = useState<Record<number, Hint>>(emptyHints());

  const onHintChange = (hint: Hint) => {
    hints[hint.position] = hint;
    setHints(hints);
  };

  const onFormSubmit = (evt: Event) => {
    evt.preventDefault();

    const guess = { hints: [hints[0], hints[1], hints[2], hints[3], hints[4]] };

    if (getWord(guess).length == 5) {
      onSubmit(guess);
      setHints(emptyHints());
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      <HintInput hint={hints[0]} onChange={onHintChange} />
      <HintInput hint={hints[1]} onChange={onHintChange} />
      <HintInput hint={hints[2]} onChange={onHintChange} />
      <HintInput hint={hints[3]} onChange={onHintChange} />
      <HintInput hint={hints[4]} onChange={onHintChange} />
      <button type="submit">Save</button>
    </form>
  );
};
