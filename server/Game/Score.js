import { Observer } from "../Publisher/Observer.js"

export class ScoreManager extends Observer {
	constructor() {
		this.score = 0
	}

	update(state) {
		this.score += 100 * state.linesCleared
	}
}
