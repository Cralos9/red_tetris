import { Game } from "./game.js";

const game = new Game(10, 10)

for (let i = 0; i < 7; i++) {
	game.update()
}
