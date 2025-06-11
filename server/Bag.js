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
	Ooffsets
} from "./gameParams.js"

export class Bag {
	constructor () {
		this.pieces = {
			"I": new Piece(Icoor, Ioffsets, 1),
			"T": new Piece(Tcoor, JLTSZoffsets, 2),
			"J": new Piece(Jcoor, JLTSZoffsets, 3),
			"L": new Piece(Lcoor, JLTSZoffsets, 4),
			"O": new Piece(Ocoor, Ooffsets, 5),
			"S": new Piece(Scoor, JLTSZoffsets, 6),
			"Z": new Piece(Zcoor, JLTSZoffsets, 7),
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
	
	getStack() {
		return (this.stack)
	}
}
