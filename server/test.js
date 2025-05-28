import { Game } from "./game.js";

const game = new Game(10, 10)

for (let i = 0; i < 2; i++) {
	game.update()
	console.table(game.field)
}
//console.log(game.Bag.order)
