import { log } from "./debug.js"
import { moveHorizontal, moveVertical, rotation } from "./movement.js"

export class Piece {
	constructor(piece, patterns, skirts, color) {
		this.piece = piece
		this.patterns = patterns
		this.skirts = skirts
		this.index = 0
		this.height = 0
		this.row = 0
		this.column = 5
		this.color = color
	}

	checkCollision(field, ROWS) {
		const skirt = this.getCurrSkirt()
		const checkRow = this.row + 1

		if (checkRow === ROWS) {
			return (1)
		}
		console.log("Skirt:", skirt)
		for (let i = 0; i < skirt.length; i++) {
			const arr = skirt[i]
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
		const pattern = this.getCurrPattern()

		console.log("Pattern", pattern)
		for (let y = 0; y < pattern.length; y++) {
			const arr = pattern[y]
			//log(y, arr)
			if (this.row + arr[1] > -1) {
				field[this.row + arr[1]][this.column + arr[0]] = color
			}
		}
	}

	move(x, y) {
		this.column += x
		this.row += y
		log("Moved Piece Vertical:", this.row)
		log("Moved Piece to column:", this.column)
		moveVertical(0)
		moveHorizontal(0)
	}

	rotate(r) {
		this.index += r
		this.index = this.index % 4
		rotation(0)
	}

	getCurrSkirt() {
		return this.skirts[this.index]
	}

	getCurrPattern() {
		return this.patterns[this.index]
	}

	toString() {
		return `Piece: ${this.piece}`
	}
}
