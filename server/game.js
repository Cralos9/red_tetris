import { Bag } from "./Bag.js"
import { log } from "./debug.js"
import { getMoves } from "./movement.js"

export class Game {
	constructor(columns, rows, socket) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.Bag = new Bag()
		this.row = -1
		this.field = []

		this.socket = socket

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
		log("Last Row:", this.row)
		log("Current Piece Row:", this.Piece.row)
		
		if (this.Piece.checkCollision(this.field, this.ROWS)) {
			this.Piece.row = 0
			this.row = -1
			this.Piece = this.Bag.getNextPiece()
			this.socket.emit('color', this.Piece.color)
		} else {
			this.Piece.drawPiece(this.field, this.ROWS, this.row, 0)
			const moves = getMoves()
			this.Piece.move(moves.x)
			this.Piece.rotate(moves.r)
			this.row++;
			this.Piece.row++
			log("Draw Row:", this.row)
			this.Piece.drawPiece(this.field, this.ROWS, this.row, 1)
		}
		this.socket.emit('action', {field: this.field})
	}
}
