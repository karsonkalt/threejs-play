import { validKeys } from "./utils";

export class Wordle {
  level: number;
  letterIndex: number;
  currentWord: string;
  word: string;

  constructor() {
    this.level = 0;
    this.letterIndex = 0;
    this.currentWord = "";
    this.word = "canoe";
  }

  createBoard() {}

  addLetter(event: KeyboardEvent) {
    if (event.key === "Enter") {
      if (this.currentWord.length === 5) {
        for (let i = 0; i < 5; i++) {
          const letter = this.word[i];
        }
        this.level += 1;
        this.currentWord = "";
      }
    } else if (event.key === "Backspace") {
      this.letterIndex -= 1;
      this.currentWord = this.currentWord.slice(0, -1);
    } else if (validKeys.includes(event.key)) {
      if (this.currentWord.length === 5) {
        return;
      }
      this.letterIndex += 1;
      this.currentWord += event.key;
    }
  }
}
