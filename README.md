# Wordle Solver

## Rules of the Game

The goal of Wordle is to guess a word in less than 6 guesses. The word will only contain alphabetic letters. There are no numbers or symbols in the word.

- Each guess must be a valid five letter word.
- Each guess will be given hints if letters from the word match the solution.
- Exact matches are marked green, meaning the letter is correct, and is in the correct position.
- Partial matches are marked yellow, meaning the letter is correct, but in the wrong position.

The player is encouraged to use the hints from their current guess to inform the next best guess.

If a guessed word results in 5 exact matches the solution has been found and the game is won. If 6 guesses do not result in a solution the game is lost.

## Solver

The solver takes user input, with the user inputting the guess they made, as well as the hints received from the Wordle game. The solver will then output a list of possible words remaining based on the cumulative hints of all the guesses.

## TODO

- Format the previous guesses like the input for the current guess, including hints.
