import Strategy from "./Strategy.js"
import { ROWS, COLUMNS } from "../gameParams.js"
import { randomNbr } from "../utils.js"

export class CreateGarbage42 extends Strategy {
	constructor() { super() }

	execute(game, garbageLines) {
		for (let i = 0; i < garbageLines; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			game.field[y] = garbage
		}
	}
}

export class CreateGarbageTetris extends Strategy {
	constructor() { super() }

	execute(game, garbageLines) {
		const gap = randomNbr(COLUMNS - 1)

		for (let i = 0; i < garbageLines; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			garbage[gap] = 0
			game.field[y] = garbage
		}
	}
}
