import { Piece } from "./Piece.js"
import { getRandomOrder } from "./utils.js"
import {
	Icoor,
	Tcoor,
	Jcoor,
	Lcoor,
	Ocoor,
	Scoor,
	Zcoor
} from "./gameParams.js"

const pieces = {
	"I": new Piece(Icoor, 1),
	"T": new Piece(Tcoor, 2),
	"J": new Piece(Jcoor, 3),
	"L": new Piece(Lcoor, 4),
	"O": new Piece(Ocoor, 5),
	"S": new Piece(Scoor, 6),
	"Z": new Piece(Zcoor, 7),
}

export class Bag {
	constructor () {
		this.stack = []
		this.order = ["I", "T", "J", "L", "O", "S", "Z"]
		getRandomOrder(this.order)
		for (let i = 0; i < this.order.length; i++) {
			this.stack.push(pieces[this.order[i]])
		}
		this.rotation = 7
	}

	getNextPiece() {
		if (this.rotation === this.order.length) {
			getRandomOrder(this.order)
			this.rotation = 0
		}
		this.stack.push(pieces[this.order[this.rotation]])
		this.rotation++
		return (this.stack.shift())
	}
	
	getStack() {
		return (this.stack)
	}
}
