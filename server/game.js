import { Bag } from "./Bag.js"
import { IPosition } from "./piecePosition.js"

export class Game {
	constructor(columns, rows) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.Bag = new Bag()
		this.field = []

		for (let i = 0; i < this.ROWS; i++) {
			let arr = []
			for (let j = 0; j < this.COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}
	}

	update() {
		this.Bag.makeNewOrder()
		console.log(this.Bag.getCurrentPiece().toString())
	}
}
