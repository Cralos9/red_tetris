import { Bag } from "./Bag.js"

export class Game {
	constructor(columns, rows) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.Bag = new Bag()
		this.row = 0
		this.column = this.COLUMNS / 2
		this.field = []

		for (let i = 0; i < this.ROWS; i++) {
			let arr = []
			for (let j = 0; j < this.COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}

		this.Bag.makeNewOrder()
		this.Piece = this.Bag.getCurrentPiece()
		console.log(this.Piece.toString())
	}

	checkCollision(pattern) {
		if (this.Piece.row === this.ROWS - 1) {
			console.log("Collision")
			return (1)
		}
		for (let x = 0; x < pattern[0].length; x++) {
			if (this.field[this.Piece.row + 1][this.column + x] == 1) {
				console.log("Piece Collision")
				return (1)
			}
		}
		return (0)
	}

	update() {
		const pattern = this.Piece.getCurrPattern()
		console.log("Currrent Row:", this.row)
		console.log("Current Piece Row:", this.Piece.row)
		
		for (let row = 0; row < pattern.length; row++) {
			const rIndex = this.row + row
			const pieceLength = pattern[row].length
			if (rIndex > -1 && rIndex < this.ROWS) {
				for (let column = 0; column < pieceLength; column++) {
					const cIndex = this.column + column
					this.field[rIndex][cIndex] = 0
				}
			}
		}

		this.row++;

		for (let row = 0; row < pattern.length; row++) {
			const rIndex = this.row + row
			const pieceLength = pattern[row].length
			if (rIndex > -1 && rIndex < this.ROWS) {
				for (let column = 0; column < pieceLength; column++) {
					if (pattern[row][column] === 1) {
						const cIndex = this.column + column
						this.field[rIndex][cIndex] = pattern[row][column]
					}
				}
			}
		}

		if (this.checkCollision(pattern)) {
			this.Piece.row = 0
			this.row = 0
			this.Piece = this.Bag.getNextPiece()
		}
		else {
			this.Piece.row++
		}
	}
}
