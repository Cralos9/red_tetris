import { Bag } from "./Bag.js"
import { log } from "./debug.js"
import { getMoves } from "./movement.js"
//import { Piece } from "./Piece.js"
//import { piecesMap } from "./piecePosition.js";

const SPEED = 1;

export class Game {
	constructor(columns, rows, socket) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.Bag = new Bag()
		this.field = []

		this.socket = socket

		for (let i = 0; i < this.ROWS; i++) {
			let arr = []
			for (let j = 0; j < this.COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}

		this.Piece = this.Bag.getCurrentPiece()
		//const piece = piecesMap["T"]
		//this.Piece = new Piece("T", piece.patterns, piece.skirts)
		log(this.Piece.toString())
		this.time = Date.now()
	}

	update() {
		log("Current Piece Row:", this.Piece.row)
		
		if (this.Piece.checkCollision(this.field, this.ROWS)) {
			log("Collision")
			this.Piece.row = -1
			this.Piece.column = 5
			this.Piece = this.Bag.getNextPiece()
			console.log(this.Piece.toString())
			//this.socket.emit('color', this.Piece.color)
		} else {
			this.Piece.drawPiece(this.field, 0)
			const moves = getMoves()
			this.Piece.move(moves.x, moves.y, this.COLUMNS)
			this.Piece.rotate(moves.r)
			if (Date.now() - this.time >= 1000 / SPEED) {
				this.Piece.row++
				this.time = Date.now()
			}
			this.Piece.drawPiece(this.field, 1)
		}
		this.socket.emit('action', {field: this.field})
	}
}
