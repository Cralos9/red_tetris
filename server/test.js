import { Game } from "./game.js";

const game = new Game(10, 10)

//while (1) {
//	await new Promise(r => setTimeout(r, 500))
//	game.update()
//	console.table(game.field)
//}

for (let i = 0; i < 2; i++) {
	game.update()
	console.table(game.field)
}
