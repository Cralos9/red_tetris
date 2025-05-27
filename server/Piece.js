import { log } from "./debug.js"
import { moveHorizontal, rotation } from "./movement.js"

export class Piece {
	constructor(piece, patterns, color) {
		this.piece = piece
		this.patterns = patterns
		this.pattern = 0
		this.height = this.getHeight()
		this.row = 0
		this.column = 5
		this.color = color
	}

	checkCollision(field, ROWS) {
		const checkRow = this.row + 1
		const pattern = this.getCurrPattern()
		let line = 0

		if (checkRow === ROWS) {
			console.log("Collision")
			return (1)
		}
		log("Checking Row:", this.row + 1)
		for (let y = 0; y < pattern.length; y++) {
			if (pattern[y].find(element => element === 1)) {
				line = y
			}
		}

		log("Last Line:", line)
		for (let x = 0; x < pattern[line].length; x++) {
			if (pattern[line][x] === 1 && field[checkRow][this.column + x] === 1) {
				console.log("Piece Collision")
				return (1)
			}
		}
		return (0)
	}

	drawPiece(field, ROWS, drow, color) {
		const pattern = this.getCurrPattern()

		for (let row = 0; row < pattern.length; row++) {
			const rIndex = drow + row
			const pieceLength = pattern[row].length
			if (rIndex > -1 && rIndex < ROWS) {
				for (let column = 0; column < pieceLength; column++) {
					if (pattern[row][column] === 1) {
						const cIndex = this.column + column
						field[rIndex][cIndex] = color
					}
				}
			}
		}
	}

	getHeight() {
		const pattern = this.getCurrPattern()
		let height;

		for (let i = 0; i < pattern.length; i++) {
			if (pattern[i].find(element => element === 1)) {
				height = i
			}
		}
		return (height)
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
		const height = Math.abs(this.height - this.getHeight())
		this.row = this.row + height
		this.height = height
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
