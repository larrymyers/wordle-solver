import { useEffect, useState } from "preact/hooks";
import { getPossibleWords, HintType, type Hint } from "../solver/solver";

interface Guess {
  hints: Hint[];
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
  const { letter, type, position } = hint;

  const handleKey = (evt: KeyboardEvent) => {
    if (evt.code == "ArrowLeft") {
      onChange({ letter, position, type: "GREEN" });
    }

    if (evt.code == "ArrowRight") {
      onChange({ letter, position, type: "YELLOW" });
    }

    if (evt.code == "ArrowDown") {
      onChange({ letter, position, type: "NONE" });
    }

    if (evt.key.length == 1) {
      onChange({ letter: evt.key.toUpperCase(), type, position });
    }
  };

  const greenStyle = "border-green-800 bg-green-300";
  const yellowStyle = "border-yellow-500 bg-yellow-200";

  let typeStyle = "border-slate-800";
  if (type == "GREEN") {
    typeStyle = greenStyle;
  } else if (type == "YELLOW") {
    typeStyle = yellowStyle;
  }

  return (
    <div class="relative inline-block">
      <input
        class={`w-10 h-12 p-2 mx-2 border-2 focus:border-blue-500 text-2xl ${typeStyle}`}
        value={letter}
        onKeyDown={handleKey}
        type="text"
        maxLength={1}
      />
    </div>
  );
};

const emptyHints = (): Hint[] => {
  return [
    { letter: "", position: 0, type: "NONE" },
    { letter: "", position: 1, type: "NONE" },
    { letter: "", position: 2, type: "NONE" },
    { letter: "", position: 3, type: "NONE" },
    { letter: "", position: 4, type: "NONE" },
  ];
};

interface GuessInputProps {
  onSubmit: (guess: Guess) => void;
}

export const GuessInput = ({ onSubmit }: GuessInputProps) => {
  const [hints, setHints] = useState<Hint[]>(emptyHints());

  const onHintChange = (hint: Hint) => {
    const p = hint.position;
    const nextHints = hints.slice(0, p).concat([hint], hints.slice(p + 1));
    setHints(nextHints);
  };

  const onFormSubmit = (evt: Event) => {
    evt.preventDefault();

    const guess = { hints };

    if (getWord(guess).length == 5) {
      onSubmit(guess);
      setHints(emptyHints());
    }
  };

  return (
    <form onSubmit={onFormSubmit}>
      {Object.values(hints).map((hint) => (
        <HintInput hint={hint} onChange={onHintChange} />
      ))}
      <button type="submit">Save</button>
    </form>
  );
};
