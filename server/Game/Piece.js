import { log } from "../debug.js"
import { COLUMNS, ROWS } from "./gameParams.js"
import { getRotations, getSkirt, compare, getKicks } from "./utils.js"

export class Piece {
	constructor(pieceCoor, pieceOffsets, color) {
		this.patterns = pieceCoor
		this.offsets = pieceOffsets
		this.skirts = [getSkirt(pieceCoor[0])]
		for (let i = 0; i < 3; i++) {
			const tmp = getRotations(this.patterns[i]).sort(compare)
			this.skirts.push(getSkirt(tmp))
			this.patterns.push(tmp)
		}
		this.index = 0
		this.row = 1
		this.column = 5
		this.color = color
	}

	move(x) {
		this.column += x
		log("Moved Piece to column:", this.column)
	}

	checkRotation(field, kick, pattern) {
		for (let k = 0; k < pattern.length; k++) {
			const x = this.column + pattern[k][0] + kick[0]
			const y = this.row + pattern[k][1] + kick[1]
			log("WallKicks: (", y, ", ", x, ")")
			if (x >= COLUMNS || x < 0 || y >= ROWS || y < 0 || field[y][x] > 0) {
				log("Cant do this rotation")
				return (false)
			}
		}
		return (true)
	}

	rotate(field, r) {
		let rot = this.index + r + 4
		rot = rot % 4
		const kicks = getKicks(this.offsets[this.index], this.offsets[rot])
		const pattern = this.patterns[rot]
		if (r === 1 || r === -1) {
			for (let i = 0; i < kicks.length; i++) {
				log("Kick:", kicks[i])
				if (this.checkRotation(field, kicks[i], pattern)) {
					this.row += kicks[i][1]
					this.column += kicks[i][0]
					this.index = rot
					log("Rotated Piece:", this.index)
					break
				}
			}
		}
	}

	getCurrSkirt() {
		return this.skirts[this.index]
	}

	getCurrPattern() {
		return this.patterns[this.index]
	}

	reset() {
		this.row = 1
		this.column = 5
		this.index = 0
	}

	toString() {
		return `Piece Color: ${this.color}`
	}

	toObject() {
		return {
			pattern: this.patterns[0],
			color: this.color
		}
	}
}
