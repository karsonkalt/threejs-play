import { GameState, LetterFeedback, LetterStatus } from "./types";
import { validKeys } from "./utils";

export class Wordle {
  private state: GameState;

  constructor(word: string, maxAttempts: number = 6) {
    this.state = {
      solution: word.toLowerCase(),
      attempts: 0,
      maxAttempts: maxAttempts,
      history: [],
      isGameOver: false,
      isWin: false,
    };
  }

  public makeGuess(guess: string): LetterFeedback[] {
    if (this.state.isGameOver) {
      throw new Error("Game is already over.");
    }

    guess = guess.toLowerCase();
    if (guess.length !== this.state.solution.length) {
      throw new Error(
        `Guess must be ${this.state.solution.length} letters long.`
      );
    }

    const feedback: LetterFeedback[] = this.evaluateGuess(guess);
    this.state.history.push(feedback);
    this.state.attempts++;

    if (feedback.every((f) => f.status === LetterStatus.Correct)) {
      this.state.isWin = true;
      this.state.isGameOver = true;
    } else if (this.state.attempts >= this.state.maxAttempts) {
      this.state.isGameOver = true;
    }

    return feedback;
  }

  private evaluateGuess(guess: string): LetterFeedback[] {
    const feedback: LetterFeedback[] = [];
    const solutionArr = this.state.solution.split("");
    const guessArr = guess.split("");

    for (let i = 0; i < guessArr.length; i++) {
      const letter = guessArr[i];
      if (letter === solutionArr[i]) {
        feedback.push({ letter, status: LetterStatus.Correct });
      } else if (solutionArr.includes(letter)) {
        feedback.push({ letter, status: LetterStatus.Present });
      } else {
        feedback.push({ letter, status: LetterStatus.Absent });
      }
    }

    return feedback;
  }

  public get currentRow(): number {
    return this.state.history.length;
  }

  public get gameState(): GameState {
    return this.state;
  }
}
