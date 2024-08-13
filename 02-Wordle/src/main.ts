import { Wordle } from "./lib/Wordle";
import { WordleDom } from "./lib/WordleDom";

const wordle = new WordleDom(new Wordle("canoe"));
wordle.createBoard();
