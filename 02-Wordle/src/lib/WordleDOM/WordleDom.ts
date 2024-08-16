import { LetterFeedback, LetterStatus } from "../types";
import { Wordle } from "../Wordle";

export class WordleDOM {
  private game: Wordle;
  private gameBoard: HTMLElement;
  private message: HTMLElement;

  constructor(word: string) {
    this.game = new Wordle(word);
    this.gameBoard = this.createGameBoard();
    this.message = this.createMessageArea();
    this.listenForKeyPresses();
  }

  private get currentRow(): HTMLElement {
    return this.gameBoard.children[this.game.currentRow] as HTMLElement;
  }

  private get currentLetterBoxes(): HTMLCollectionOf<Element> {
    return this.currentRow.getElementsByClassName("letter-box");
  }

  private createGameBoard() {
    const gameBoard = document.createElement("div");
    gameBoard.id = "game-board";

    for (let i = 0; i < this.game.gameState.maxAttempts; i++) {
      const row = document.createElement("div");
      row.className = "row";

      console.log(this.game.gameState.solution.length);

      for (let j = 0; j < this.game.gameState.solution.length; j++) {
        const letterBox = document.createElement("div");
        letterBox.className = "letter-box";
        row.appendChild(letterBox);
      }

      gameBoard.appendChild(row);
    }

    const appElement = document.querySelector("#app");
    appElement?.appendChild(gameBoard);
    return gameBoard;
  }

  private createMessageArea() {
    const message = document.createElement("div");
    message.id = "message";
    message.style.marginTop = "20px";
    message.style.fontSize = "1.2rem";
    document.body.appendChild(message);

    return message;
  }

  private listenForKeyPresses() {
    document.addEventListener("keydown", (event) => {
      if (this.game.gameState.isGameOver) return;

      const key = event.key.toLowerCase();
      if (key === "enter") {
        this.submitGuess();
      } else if (key === "backspace") {
        this.removeLastLetter();
      } else if (
        /^[a-z]$/.test(key) &&
        this.game.gameState.currentGuess.length <
          this.game.gameState.solution.length
      ) {
        this.addLetter(key);
      }
    });
  }

  private addLetter(letter: string) {
    this.game.addLetter(letter);
    const letterBox = this.currentLetterBoxes[
      this.game.gameState.currentGuess.length - 1
    ] as HTMLElement;
    letterBox.textContent = letter.toUpperCase();
  }

  private removeLastLetter() {
    if (this.game.gameState.currentGuess.length > 0) {
      const letterBox = this.currentLetterBoxes[
        this.game.gameState.currentGuess.length - 1
      ] as HTMLElement;
      letterBox.textContent = ""; // Clear the letter box
      this.game.removeLetter();
    }
  }

  private submitGuess() {
    if (
      this.game.gameState.currentGuess.length !==
      this.game.gameState.solution.length
    ) {
      this.message.textContent = `Guess must be ${this.game.gameState.solution.length} letters long.`;
      return;
    }

    const currentRowBeforeSubmit = this.currentRow;

    const feedback = this.game.makeGuess();
    this.updateGameBoard(feedback, currentRowBeforeSubmit);

    if (this.game.gameState.isGameOver) {
      if (this.game.gameState.isWin) {
        this.message.textContent = "Congratulations! You've won!";
      } else {
        this.message.textContent = `Game Over! The word was "${this.game.gameState.solution}".`;
      }
    } else {
      this.game.gameState.currentGuess = "";
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
