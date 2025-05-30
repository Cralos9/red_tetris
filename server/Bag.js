import { Piece } from "./Piece.js"
import { randomNbr } from "./utils.js"
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
		this.order = [
			"I",
			"T",
			"J",
			"L",
			"O",
			"S",
			"Z"
		]
		for (let i = 0; i < this.order.length; i++) {
			this.stack.push(pieces[this.order[i]])
		}
	}

	getNextPiece() {
		this.stack.pop()
		this.stack.unshift(pieces[this.order[randomNbr(6)]])
		return (this.stack[this.stack.length - 2])
	}
	
	getCurrentPiece() {
		return (this.stack[this.stack.length - 1])
	}
}
