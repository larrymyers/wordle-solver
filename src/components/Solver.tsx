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
  position: number;
  onChange: (hint: Hint) => void;
}

const HintInput = ({ position, onChange }: HintInputProps) => {
  const [letter, setLetter] = useState("");
  const [type, setType] = useState<HintType>("NONE");
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    const handleKey = (evt: KeyboardEvent) => {
      if (evt.code == "ArrowLeft") {
        setType("GREEN");
      }

      if (evt.code == "ArrowRight") {
        setType("YELLOW");
      }

      if (evt.code == "ArrowDown") {
        setType("NONE");
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, [active]);

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
        onFocus={() => setActive(true)}
        onInput={(evt) => {
          const nextLetter = (evt.target as HTMLInputElement).value;
          setLetter(nextLetter.toUpperCase());
        }}
        onBlur={() => {
          setActive(false);
          onChange({ letter, type, position });
        }}
        type="text"
        maxLength={1}
      />
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
      <HintInput position={0} onChange={onHintChange} />
      <HintInput position={1} onChange={onHintChange} />
      <HintInput position={2} onChange={onHintChange} />
      <HintInput position={3} onChange={onHintChange} />
      <HintInput position={4} onChange={onHintChange} />
      <button type="submit">Save</button>
    </form>
  );
};
