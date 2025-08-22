import CreateGarbageBehaviour from "./CreateGarbageBehaviour.js"
import { randomNbr } from "../utils.js"
import { ROWS, COLUMNS } from "../gameParams.js"

export default class CreateGarbageTetris extends CreateGarbageBehaviour {
	constructor() { super() }

	placeGarbage(game, garbageLines) {
		const gap = randomNbr(COLUMNS - 1)

		for (let i = 0; i < garbageLines; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			garbage[gap] = 0
			game.field[y] = garbage
		}
	}
}
