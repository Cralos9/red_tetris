import { Bag } from "./Bag.js"

export class Game {
	constructor(columns, rows) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.Bag = new Bag()
		this.currRow = 0
		this.currColumn = this.COLUMNS / 2
		this.field = []

		for (let i = 0; i < this.ROWS; i++) {
			let arr = []
			for (let j = 0; j < this.COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}

		this.Bag.makeNewOrder()
		this.currPiece = this.Bag.getCurrentPiece()
		console.log(this.currPiece.toString())
		// Piece in the middle: (COLUMNS - piece.length) / 2
	}

	update() {
		const piece = this.Bag.getCurrentPiece()
		//console.log(piece.toString())
		const pos = piece.getCurrPosition()
		//console.log(pos)
		
		if (this.currRow != 0) {
			for (let i = 0; i < this.COLUMNS; i++) {
				const index = this.currRow - 1
				this.field[index][i] = 0
			}
		}
		
		for (let row = 0; row < pos.length; row++) {
			const rIndex = this.currRow + row
			const pieceLength = pos[row].length
			for (let column = 0; column < pieceLength; column++) {
				const cIndex = this.currColumn + column
				this.field[rIndex][cIndex] = pos[row][column]
			}
		}
		console.table(this.field)
		this.currRow++
	}
}
