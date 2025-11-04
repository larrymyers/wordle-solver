import { useState, useEffect } from "preact/hooks";
import { getPossibleWords, loadWords } from "../solver/solver";
import type { Hint, Guess } from "../solver/solver";

export const Solver = () => {
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [wordList, setWordList] = useState<string[]>([]);

  useEffect(() => {
    loadWords().then((words) => setWordList(words));
  }, []);

  useEffect(() => {
    setWordList(getPossibleWords(wordList, guesses));
  }, [guesses]);

  const addGuess = (guess: Guess) => {
    setGuesses(guesses.concat([guess]));
  };

  return (
    <div class="flex flex-col sm:flex-row">
      <div class="sm:basis-1/2">
        <h2 class="text-2xl font-bold mb-4 dark:text-white">Guesses</h2>
        {guesses.map((guess) => (
          <PreviousGuess guess={guess} />
        ))}
        <GuessInput onSubmit={addGuess} initialWord={selectedWord} />
      </div>
      <div class="mt-8 sm:mt-0 sm:basis-1/2">
        <h2 class="text-2xl font-bold mb-4 dark:text-white">Possible Words ({wordList.length})</h2>
        {wordList.slice(0, 30).map((word) => (
          <div
            class="text-lg dark:text-white cursor-pointer"
            onClick={() => setSelectedWord(word.toUpperCase())}
          >
            {word.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
};

const getWord = (guess: Guess) => guess.hints.map((hint) => hint.letter).join("");

export const PreviousGuess = ({ guess }: { guess: Guess }) => {
  const word = getWord(guess);

  if (word.length < 5) {
    return <></>;
  }

  const hints = guess.hints.map((hint) => {
    const { letter, type } = hint;

    const greenStyle = "border-green-800 bg-green-300";
    const yellowStyle = "border-yellow-500 bg-yellow-200";

    let typeStyle = "border-slate-800 dark:bg-slate-700 dark:text-white";
    if (type == "GREEN") {
      typeStyle = greenStyle;
    } else if (type == "YELLOW") {
      typeStyle = yellowStyle;
    }

    return (
      <div
        class={`inline-block w-10 h-12 p-2 mx-2 my-2 border-2 focus:border-blue-500 text-2xl ${typeStyle}`}
      >
        {letter}
      </div>
    );
  });

  return <div>{hints}</div>;
};

interface HintInputProps {
  hint: Hint;
  onChange: (hint: Hint) => void;
  onActive: (position: number) => void;
}

const HintInput = ({ hint, onChange, onActive }: HintInputProps) => {
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

  let typeStyle = "border-slate-800 dark:bg-slate-700 dark:text-white";
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
        onFocus={() => onActive(hint.position)}
        onKeyDown={handleKey}
        type="text"
        maxLength={1}
      />
    </div>
  );
};

const emptyHints = (word: string): Hint[] => {
  if (word.length != 5) {
    word = "     ";
  }

  return word.split("").map((letter, i) => ({ letter, position: i, type: "NONE" }));
};

interface GuessInputProps {
  onSubmit: (guess: Guess) => void;
  initialWord?: string;
}

export const GuessInput = ({ onSubmit, initialWord }: GuessInputProps) => {
  const [hints, setHints] = useState<Hint[]>(emptyHints(initialWord || ""));
  const [activeHint, setActiveHint] = useState<number>(0);

  useEffect(() => {
    if (initialWord) {
      setHints(emptyHints(initialWord));
    }
  }, [initialWord]);

  const onHintChange = (hint: Hint) => {
    const p = hint.position;
    const nextHints = hints.slice(0, p).concat([hint], hints.slice(p + 1));
    setHints(nextHints);
  };

  const onHintActive = (position: number) => setActiveHint(position);

  const onFormSubmit = (evt: Event) => {
    evt.preventDefault();

    const guess = { hints };

    if (getWord(guess).length == 5) {
      onSubmit(guess);
      setHints(emptyHints(""));
    }
  };

  return (
    <form class="mt-6" onSubmit={onFormSubmit}>
      {Object.values(hints).map((hint) => (
        <HintInput hint={hint} onChange={onHintChange} onActive={onHintActive} />
      ))}
      <div class="flex flex-row space-x-4 my-6">
        <button
          class="rounded border-yellow-500 border-2 bg-yellow-200 text-black font-bold py-2 px-4"
          type="button"
          onClick={() => {
            const hint = hints[activeHint];
            hint.type = "YELLOW";
            onHintChange(hint);
          }}
        >
          Partial
        </button>
        <button
          class="rounded border-green-800 border-2 bg-green-300 text-black font-bold py-2 px-4"
          type="button"
          onClick={() => {
            const hint = hints[activeHint];
            hint.type = "GREEN";
            onHintChange(hint);
          }}
        >
          Exact
        </button>
        <button
          class="rounded border-slate-800 border-2 bg-white text-slate-800 font-bold py-2 px-4"
          type="button"
          onClick={() => {
            const hint = hints[activeHint];
            hint.type = "NONE";
            onHintChange(hint);
          }}
        >
          None
        </button>
      </div>
      <button
        class="rounded border-blue-800 border-2 bg-blue-600 text-white font-bold py-2 px-4"
        type="submit"
      >
        Save
      </button>
    </form>
  );
};
