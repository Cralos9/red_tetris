import Strategy from "./Strategy.js"
import { ROWS, COLUMNS } from "../gameParams.js"

class PatternMatch42 extends Strategy {
	constructor() { super() }

	execute(game) {
		for (let y = ROWS - 1; y >= 0; y--) {
			let count = 0
			for (let x = 0; x < COLUMNS; x++) {
				// Substitue 8 with a readable string like COLORS.GARBAGE
				if (game.field[y][x] > 0 && game.field[y][x] !== 8) {
					count++
					game.stackHeight = y
				}
			}
			if (count === game.field[y].length) {
				game.hitList.push(y)
			}
		}
	}
}

class PatternMatchTetris extends Strategy {
	constructor() { super() }

	execute(game) {
		for (let y = ROWS - 1; y >= 0; y--) {
			let count = 0
			for (let x = 0; x < COLUMNS; x++) {
				if (game.field[y][x] > 0) {
					count++
					game.stackHeight = y
				}
			}
			if (count === game.field[y].length) {
				game.hitList.push(y)
			}
		}
	}
}

export const patternMatch42 = new PatternMatch42()
export const patternMatchTetris = new PatternMatchTetris()
