import { validKeys } from "./utils";

export class Wordle {
  attempt: number;
  letterIndex: number;
  currentWord: string;
  word: string;
  validKeys: string[];

  constructor(word: string) {
    this.attempt = 0;
    this.letterIndex = 0;
    this.currentWord = "";
    this.word = word;
    this.validKeys = validKeys;
  }

  resetGame(newWord: string) {
    this.attempt = 0;
    this.letterIndex = 0;
    this.currentWord = "";
    this.word = newWord;
  }

  addLetter(key: string): void {
    if (key === "Enter") {
      if (this.currentWord.length === 5) {
        if (this.currentWord !== this.word) {
          this.attempt += 1;
          this.currentWord = "";
        }
      }
    } else if (key === "Backspace") {
      this.letterIndex -= 1;
      this.currentWord = this.currentWord.slice(0, -1);
    } else if (this.validKeys.includes(key)) {
      if (this.currentWord.length === 5) {
        return;
      }
      this.letterIndex += 1;
      this.currentWord += key;
    }
  }

  getCurrentWord(): string {
    return this.currentWord;
  }

  getAttempt(): number {
    return this.attempt;
  }

  isGameOver(): boolean {
    return this.currentWord === this.word || this.attempt >= 6;
  }
}
