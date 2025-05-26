import { Bag } from "./Bag.js"

export class Game {
	constructor(columns, rows) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.Bag = new Bag()
		this.row = -1
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

	update() {
		console.log("Last Row:", this.row)
		console.log("Current Piece Row:", this.Piece.row)
		
		if (this.Piece.checkCollision(this.field, this.ROWS, this.column)) {
			this.Piece.row = 0
			this.row = -1
			this.Piece = this.Bag.getNextPiece()
		} else {
			this.Piece.drawPiece(this.field, this.ROWS, this.row, this.column, 0)
			this.row++;
			this.Piece.row++
			console.log("Draw Row:", this.row)
			this.Piece.drawPiece(this.field, this.ROWS, this.row, this.column, 1)
		}
	}
}
