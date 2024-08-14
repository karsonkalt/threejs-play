import { LetterFeedback, LetterStatus } from "./types";
import { Wordle } from "./Wordle";

export class WordleDOM {
  private game: Wordle;
  private currentGuess: string;
  private gameBoard: HTMLElement;
  private message: HTMLElement;

  constructor(word: string) {
    this.game = new Wordle(word);
    this.currentGuess = "";
    this.createGameBoard();
    this.createMessageArea();
    this.listenForKeyPresses();
  }

  private get currentRow(): HTMLElement {
    return this.gameBoard.children[this.game.currentRow] as HTMLElement;
  }

  private createGameBoard() {
    this.gameBoard = document.createElement("div");
    this.gameBoard.id = "game-board";

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("div");
      row.className = "row";

      for (let j = 0; j < 5; j++) {
        const letterBox = document.createElement("div");
        letterBox.className = "letter-box";
        row.appendChild(letterBox);
      }

      this.gameBoard.appendChild(row);
    }

    document.body.appendChild(this.gameBoard);
  }

  private createMessageArea() {
    this.message = document.createElement("div");
    this.message.id = "message";
    this.message.style.marginTop = "20px";
    this.message.style.fontSize = "1.2rem";
    document.body.appendChild(this.message);
  }

  private listenForKeyPresses() {
    document.addEventListener("keydown", (event) => {
      if (this.game.gameState.isGameOver) return;

      const key = event.key.toLowerCase();
      if (key === "enter") {
        this.submitGuess();
      } else if (key === "backspace") {
        this.removeLastLetter();
      } else if (/^[a-z]$/.test(key) && this.currentGuess.length < 5) {
        this.addLetter(key);
      }
    });
  }

  private addLetter(letter: string) {
    this.currentGuess += letter;
    const currentRow = this.gameBoard.children[
      this.game.currentRow
    ] as HTMLElement;
    const letterBoxes = currentRow.getElementsByClassName("letter-box");
    const letterBox = letterBoxes[this.currentGuess.length - 1] as HTMLElement;
    letterBox.textContent = letter.toUpperCase();
  }

  private removeLastLetter() {
    if (this.currentGuess.length > 0) {
      const currentRow = this.gameBoard.children[
        this.game.currentRow
      ] as HTMLElement;
      const letterBoxes = currentRow.getElementsByClassName("letter-box");
      const letterBox = letterBoxes[
        this.currentGuess.length - 1
      ] as HTMLElement;
      letterBox.textContent = ""; // Clear the letter box
      this.currentGuess = this.currentGuess.slice(0, -1);
    }
  }

  private submitGuess() {
    if (this.currentGuess.length !== 5) {
      this.message.textContent = "Guess must be 5 letters long.";
      return;
    }

    const currentRowBeforeSubmit = this.currentRow;

    const feedback = this.game.makeGuess(this.currentGuess);
    this.updateGameBoard(feedback, currentRowBeforeSubmit);

    if (this.game.gameState.isGameOver) {
      if (this.game.gameState.isWin) {
        this.message.textContent = "Congratulations! You've won!";
      } else {
        this.message.textContent = `Game Over! The word was "${this.game.gameState.solution}".`;
      }
    } else {
      this.currentGuess = "";
    }
  }

  private updateGameBoard(feedback: LetterFeedback[], row: HTMLElement) {
    const letterBoxes = row.childNodes;
    feedback.forEach((item, index) => {
      const letterBox = letterBoxes[index] as HTMLElement;
      switch (item.status) {
        case LetterStatus.Correct:
          letterBox.classList.add("correct");
          break;
        case LetterStatus.Present:
          letterBox.classList.add("present");
          break;
        case LetterStatus.Absent:
          letterBox.classList.add("absent");
          break;
      }
    });
  }
}
