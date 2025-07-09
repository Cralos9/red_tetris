import { Piece } from "./Piece.js"
import { getRandomOrder } from "./utils.js"
import {
	Icoor,
	Tcoor,
	Jcoor,
	Lcoor,
	Ocoor,
	Scoor,
	Zcoor,
	JLTSZoffsets,
	Ioffsets,
	Ooffsets,
	Colors	
} from "./gameParams.js"

export class Bag {
	constructor () {
		this.pieces = {
			"I": new Piece(Icoor, Ioffsets, Colors.BLUE),
			"T": new Piece(Tcoor, JLTSZoffsets, Colors.PURPLE),
			"J": new Piece(Jcoor, JLTSZoffsets, Colors.ORANGE),
			"L": new Piece(Lcoor, JLTSZoffsets, Colors.DARK_BLUE),
			"O": new Piece(Ocoor, Ooffsets, Colors.YELLOW),
			"S": new Piece(Scoor, JLTSZoffsets, Colors.GREEN),
			"Z": new Piece(Zcoor, JLTSZoffsets, Colors.RED),
		}
		this.stack = []
		this.order = ["I", "T", "J", "L", "O", "S", "Z"]
		getRandomOrder(this.order)
		for (let i = 0; i < this.order.length; i++) {
			this.stack.push(this.pieces[this.order[i]])
		}
		this.rotation = 7
	}

	getNextPiece() {
		if (this.rotation === this.order.length) {
			getRandomOrder(this.order)
			this.rotation = 0
		}
		this.stack.push(this.pieces[this.order[this.rotation]])
		this.rotation++
		return (this.stack.shift())
	}

	nextPiecesArr() {
		const arr = []
		this.stack.forEach(piece => {
			arr.push(piece.toObject())
		})
		return (arr)
	}
	
	getStack() {
		return (this.stack)
	}
}
