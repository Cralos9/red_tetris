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

	move(x, y) {
		this.column += x
		this.row += y
		log("Moved Piece to column:", this.column)
	}

	getRotations(r) {
		const rot = (this.index + r + 4) % 4
		const kicks = getKicks(this.offsets[this.index], this.offsets[rot]) 
		return (kicks)
	}

	rotate(r) {
		this.index = (this.index + r + 4) % 4
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
