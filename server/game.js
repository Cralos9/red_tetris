import { Piece } from "./models.js"
import { randomNbr } from "./utils.js"
import { IPosition } from "./piecePosition.js"

export class Game {
	constructor(columns, rows) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.field = []
		this.pieces = [
			new Piece(0, 0, "I"),
			new Piece(0, 0, "T"),
			new Piece(0, 0, "O"),
			new Piece(0, 0, "J"),
			new Piece(0, 0, "L"),
			new Piece(0, 0, "S"),
			new Piece(0, 0, "Z"),
		]

		for (let i = 0; i < this.ROWS; i++) {
			let arr = []
			for (let j = 0; j < this.COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}
	}

	makeNewBag() {
		for (let i = this.pieces.length - 1; i > 0 ; i--) {
			const nbr = randomNbr(i)
			if (i === nbr) {
				continue
			}
			const tmp = this.pieces[i]
			this.pieces[i] = this.pieces[nbr]
			this.pieces[nbr] = tmp
		}
		this.pieces.forEach(element => {
			console.log(element)
		});
	}
}
