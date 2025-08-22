import CreateGarbageBehaviour from "./CreateGarbageBehaviour.js"
import { ROWS, COLUMNS } from "../gameParams.js"

export default class CreateGarbage42 extends CreateGarbageBehaviour {
	constructor() { super() }

	placeGarbage(game, garbageLines) {
		for (let i = 0; i < garbageLines; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			game.field[y] = garbage
		}
	}
}
