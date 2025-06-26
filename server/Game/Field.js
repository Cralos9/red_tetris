import { ROWS, COLUMNS } from "./gameParams.js"
import { log } from "../debug.js"

export class Field {
	constructor() {
		this.field = Array(ROWS).fill(0)
		this.stackHeight = ROWS - 1
		this.hitArr = []
		this.linesCleared = 0

		for (let i = 0; i < ROWS; i++) {
			this.field[i] = Array(COLUMNS).fill(0)
		}
	}

	patternMatch() {
		for (let y = ROWS - 1; y >= 0; y--) {
			let count = 0
			for (let x = 0; x < COLUMNS; x++) {
				if (this.field[y][x] > 0) {
					count++
					this.stackHeight = y
				}
			}
			if (count === this.field[y].length) {
				this.hitArr.push(y)
			}
		}
	}

	lineClears() {
		const linesNbr = this.hitArr.length
		const start = this.hitArr ? this.hitArr[0] : 0
		
		this.hitArr.forEach(line => {
			for (let i = 0; i < this.field[line]; i++) {
				this.field[line][i] = 0
			}
		})
		for (let y = start; y >= this.stackHeight; y--) {
			log("Moving Line,", y - linesNbr, "to,", y)
			const nextY = y - linesNbr
			for (let x = 0; x < this.field[y].length; x++) {
				if (nextY > -1) {
					this.field[y][x] = this.field[nextY][x]
				} else {
					this.field[y][x] = 0
				}
			}
		}
		this.hitArr = []
		this.stackHeight += linesNbr
		this.linesCleared = linesNbr
	}

	checkMove(piece, x, y) { 
		const pattern = piece.getCurrPattern()

		for (let i = 0; i < pattern.length; i++) {
			const fx = piece.column + x + pattern[i][0]
			const fy = piece.row + y + pattern[i][1]
			if (fy >= ROWS || fx >= COLUMNS || fy < 0 || fx < 0) {
				return (false)
			} else if (this.field[fy][fx] > 0) {
				return (false)
			}
		}
		return (true)
	}

	drawPiece(piece) {
		const pattern = piece.getCurrPattern()

		for (let y = 0; y < pattern.length; y++) {
			const arr = pattern[y]
			this.field[piece.row + arr[1]][piece.column + arr[0]] = piece.color
		}
	}

	draw(piece) {
		const currY = piece.row
		const currColor = piece.color
		this.drawPiece(piece)
		//while (this.checkMove(piece, 0, 1) === true) {
		//	piece.row++
		//}
		//piece.color = -1
		//this.drawPiece(piece)
		//piece.row = currY
		//piece.color = currColor
	}

	undraw(piece) {
		const currY = piece.row
		const currColor = piece.color
		piece.color = 0
		this.drawPiece(piece)
		while (this.checkMove(piece, 0, 1) === true) {
			piece.row++
		}
		this.drawPiece(piece)
		piece.row = currY
		piece.color = currColor
	}
}
