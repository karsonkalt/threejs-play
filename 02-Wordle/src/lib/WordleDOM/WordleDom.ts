import { LetterFeedback, LetterStatus } from "../types";
import { Wordle } from "../Wordle";

export class WordleDOM {
  private game: Wordle;
  private gameBoard: HTMLElement;
  private messageArea: HTMLElement;

  constructor(word: string) {
    this.game = new Wordle(word);
    this.gameBoard = this.createGameBoard();
    this.messageArea = this.createMessageArea();
    this.createKeyboard();
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

    const appElement = document.querySelector("#app");
    appElement?.appendChild(message);

    return message;
  }

  private listenForKeyPresses() {
    document.addEventListener("keydown", (event) => {
      if (event.repeat) return;
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
        const keyboardKey: HTMLElement | null = document.querySelector(
          `.keyboard-key[data-letter="${key}"]`
        );
        keyboardKey?.classList.add("active");
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (/^[a-z]$/.test(key)) {
        const keyboardKey: HTMLElement | null = document.querySelector(
          `.keyboard-key[data-letter="${key}"]`
        );
        keyboardKey?.classList.remove("active");
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

  private createKeyboard() {
    const keyboard = document.createElement("div");
    keyboard.id = "keyboard";

    const quertyLayout = [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"],
    ];

    quertyLayout.forEach((row) => {
      const rowElement = document.createElement("div");
      rowElement.className = "keyboard-row";
      row.forEach((letter) => {
        const key = document.createElement("div");
        key.className = "keyboard-key";
        key.dataset.letter = letter;
        key.textContent = letter.toUpperCase();
        key.addEventListener("click", () => this.addLetter(letter));
        rowElement.appendChild(key);
      });
      keyboard.appendChild(rowElement);
    });

    const submitKey = document.createElement("div");
    submitKey.className = "keyboard-key keyboard-key-submit";
    submitKey.textContent = "Submit";
    submitKey.addEventListener("click", () => this.submitGuess());
    keyboard.children[2].appendChild(submitKey);

    const appElement = document.querySelector("#app");
    appElement?.appendChild(keyboard);
  }

  private removeLastLetter() {
    if (this.game.gameState.currentGuess.length > 0) {
      const letterBox = this.currentLetterBoxes[
        this.game.gameState.currentGuess.length - 1
      ] as HTMLElement;
      letterBox.textContent = "";
      this.game.removeLetter();
    }
  }

  private submitGuess() {
    if (
      this.game.gameState.currentGuess.length !==
      this.game.gameState.solution.length
    ) {
      this.messageArea.textContent = `Guess must be ${this.game.gameState.solution.length} letters long`;
      return;
    }

    const currentRowBeforeSubmit = this.currentRow;

    const feedback = this.game.makeGuess();
    this.updateGameBoard(feedback, currentRowBeforeSubmit);

    if (this.game.gameState.isGameOver) {
      if (this.game.gameState.isWin) {
        this.messageArea.textContent = "Congratulations! You've won!";
      } else {
        this.messageArea.textContent = `The word was "${this.game.gameState.solution}"`;
      }
    } else {
      this.game.gameState.currentGuess = "";
    }
  }

  private updateGameBoard(feedback: LetterFeedback[], row: HTMLElement) {
    const letterBoxes = row.childNodes;
    feedback.forEach((item, index) => {
      // Update game board letter boxes
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

      function updateClassList(element: HTMLElement, newStatus: string) {
        if (element.classList.contains("correct")) {
          return;
        }

        if (element.classList.contains("present")) {
          if (newStatus === "correct") {
            element.classList.remove("present");
            element.classList.add("correct");
          }
          return;
        }

        if (element.classList.contains("absent")) {
          if (newStatus === "correct") {
            element.classList.remove("absent");
            element.classList.add("correct");
          } else if (newStatus === "present") {
            element.classList.remove("absent");
            element.classList.add("present");
          }
          return;
        }

        element.classList.add(newStatus);
      }

      const keyboardKey = document.querySelector(
        `.keyboard-key[data-letter="${item.letter}"]`
      ) as HTMLElement;

      updateClassList(keyboardKey, item.status);
    });
  }
}
