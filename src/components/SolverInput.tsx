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
  const [solverState, setSolverState] = useState<SolverState>({ guesses: [], wordList: [] });

  const addGuess = (guess: Guess) => {
    solverState.guesses.push(guess);
    solverState.wordList = getPossibleWords([], []);
    setSolverState(solverState);
  };

  return (
    <div>
      {solverState.guesses.map((guess) => (
        <PreviousGuess guess={guess} />
      ))}
      <GuessInput onSubmit={addGuess} />
      <div>
        {solverState.wordList.map((word) => (
          <div>{word}</div>
        ))}
      </div>
    </div>
  );
};

export const PreviousGuess = ({ guess }: { guess: Guess }) => {
  return <></>;
};

interface GuessInputProps {
  onSubmit: (guess: Guess) => void;
}

export const GuessInput = ({ onSubmit }: GuessInputProps) => {
  return <></>;
};
