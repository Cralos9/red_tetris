import { log } from "./debug.js"
import { moveHorizontal, rotation } from "./movement.js"

export class Piece {
	constructor(piece, patterns, color, skirt) {
		this.piece = piece
		this.patterns = patterns
		this.pattern = 0
		this.height = 0
		this.row = -1
		this.column = 5
		this.color = color
		this.skirt = skirt
	}

	checkCollision(field, ROWS) {
		const checkRow = this.row + 1

		if (checkRow === ROWS) {
			return (1)
		}
		log(this.skirt)
		for (let i = 0; i < this.skirt.length; i++) {
			const arr = this.skirt[i]
			const y = this.row + (arr[1] + 1)
			const x = this.column + arr[0]
			log("Checking:", y, x)
			if (y > -1 && field[y][x] === 1) {
				return (1)
			}
		}
		return (0)
	}

	drawPiece(field, color) {
		for (let y = 0; y < this.patterns.length; y++) {
			const arr = this.patterns[y]
			//log(y, arr)
			if (this.row + arr[1] > -1) {
				field[this.row + arr[1]][this.column + arr[0]] = color
			}
		}
	}

	move(x) {
		this.column += x
		log("Moved Piece to", this.column)
		moveHorizontal(0)
	}

	rotate(r) {
		this.pattern += r
		this.pattern = this.pattern % 2
		log("Before height:", this.height)
		//const height = Math.abs(this.height - this.getHeight())
		//this.row = this.row + height
		//this.height = height
		rotation(0)
		log("After height:", this.height)
	}

	getCurrPattern() {
		return this.patterns[this.pattern]
	}

	toString() {
		return `Piece: ${this.piece}`
	}
}
