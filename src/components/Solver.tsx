import { useState } from "preact/hooks";
import { getPossibleWords, type Hint } from "../solver/solver";

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

export const PreviousGuess = ({ guess }: { guess: Guess }) => {
  const word = guess.hints.map((hint) => hint.letter);

  return <div>{word}</div>;
};

interface HintInputProps {
  hint: Hint;
  onChange: (hint: Hint) => void;
}

const HintInput = ({ hint, onChange }: HintInputProps) => {
  return (
    <input
      class="w-10 h-12 p-2 mx-2 border-2 border-slate-800 focus:border-blue-500 text-2xl"
      value={hint.letter}
      onFocus={() => {}}
      onBlur={(evt) => {
        if (evt && evt.target) {
          const input = evt.target as HTMLInputElement;
          const nextLetter = input.value;
          hint.letter = nextLetter;
          onChange(hint);
        }
      }}
      type="text"
      maxLength={1}
    />
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
    onSubmit({ hints: [hints[0], hints[1], hints[2], hints[3], hints[4]] });
    setHints(emptyHints());
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
