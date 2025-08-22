import CreateGarbageBehaviour from "./CreateGarbageBehaviour.js"

export default class CreateGarbageTetris extends CreateGarbageBehaviour {
	constructor() {}

	placeGarbage(game, garbageLines) {
		const gap = randomNbr(COLUMNS - 1)

		for (let i = 0; i < garbageLines; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			game.field[y] = garbage
			game.field[gap] = 0
		}
	}
}
