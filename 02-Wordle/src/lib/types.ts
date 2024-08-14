export enum LetterStatus {
  Correct = "correct",
  Present = "present",
  Absent = "absent",
}

export interface LetterFeedback {
  letter: string;
  status: LetterStatus;
}

export interface GameState {
  solution: string;
  currentGuess: string;
  attempts: number;
  maxAttempts: number;
  history: LetterFeedback[][];
  isGameOver: boolean;
  isWin: boolean;
}
