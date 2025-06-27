import { ROWS, COLUMNS } from "./gameParams.js"

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

	checkMove(piece, column, row) { 
		const pattern = piece.getPattern()

		for (let i = 0; i < pattern.length; i++) {
			const fx = column + pattern[i][0]
			const fy = row + pattern[i][1]
			if (fy >= ROWS || fx >= COLUMNS || fy < 0 || fx < 0) {
				return (false)
			} else if (this.field[fy][fx] > 0) {
				return (false)
			}
		}
		return (true)
	}

	checkDrop(piece, column, row) {
		const skirt = piece.getSkirt()
		
		for (let i = 0; i < skirt.length; i++) {
			const fx = column + skirt[i][0]
			const fy = row + skirt[i][1]
			if (fy >= ROWS) {
				return (false)
			} else if (this.field[fy][fx] > 0) {
				return (false)
			}
		}
		return (true)
	}


	drawPiece(piece, column, row, color) {
		const pattern = piece.getPattern()

		for (let i = 0; i < pattern.length; i++) {
			const arr = pattern[i]
			this.field[row + arr[1]][column + arr[0]] = color
		}
	}

	draw(piece, column, row) {
		var ghostRow = row
		while (this.checkDrop(piece, column, ghostRow + 1) === true) {
			ghostRow++
		}
		this.drawPiece(piece, column, ghostRow, -1)
		this.drawPiece(piece, column, row, piece.color)
	}

	undraw(piece, column, row) {
		var ghostRow = row
		while (this.checkDrop(piece, column, ghostRow + 1) === true) {
			ghostRow++
		}
		this.drawPiece(piece, column, ghostRow, 0)
		this.drawPiece(piece, column, row, 0)
	}
}
