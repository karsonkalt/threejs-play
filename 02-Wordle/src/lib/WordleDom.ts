import { Wordle } from "./Wordle";

export class WordleDom {
  wordle: Wordle;

  constructor(wordle: Wordle) {
    this.wordle = wordle;
    document.addEventListener("keydown", (event) => this.handleKeydown(event));
  }

  createBoard() {
    const gameBoard = document.createElement("div");
    gameBoard.id = "game-board";

    for (let i = 0; i < 5; i++) {
      const row = document.createElement("div");
      row.className = "word-row";
      for (let j = 0; j < 5; j++) {
        const cell = document.createElement("div");
        cell.className = "letter-cell";
        row.appendChild(cell);
      }
      gameBoard.appendChild(row);
    }

    document.body.appendChild(gameBoard);
  }

  handleKeydown(event: KeyboardEvent) {
    this.wordle.addLetter(event.key);
    this.updateBoard();
  }

  updateBoard() {
    const letterCells = document.querySelectorAll(".letter-cell");
    const currentWord = this.wordle.getCurrentWord();
    for (let i = 0; i < 5; i++) {
      const cell = letterCells[i] as HTMLDivElement;
      cell.innerText = currentWord[i] || "";
    }
  }
}
