import { Piece } from "./Piece.js"
import { randomNbr } from "./utils.js"
import {
	I,
	T,
	J,
	L,
	S,
	Z,
	O,
	getSkirt
} from "./piecePosition.js"

export class Bag {
	constructor () {
		this.bag = new Map()
		this.bag.set("I", new Piece("I", I, "#00ffff", getSkirt(I)))
		this.bag.set("T", new Piece("T", T, "#800080", getSkirt(T)))
		this.bag.set("J", new Piece("J", J, "#0000ff", getSkirt(J)))
		this.bag.set("L", new Piece("L", L, "#ff7f00", getSkirt(L)))
		this.bag.set("O", new Piece("O", O, "#ffff00", getSkirt(O)))
		this.bag.set("S", new Piece("S", S, "#00ff00", getSkirt(S)))
		this.bag.set("Z", new Piece("Z", Z, "#ff0000", getSkirt(Z)))
		this.order = [
			"I",
			"T",
			"J",
			"L",
			"O",
			"S",
			"Z"
		]
		this.index = 0
	}

	getNextPiece() {
		this.index += 1
		return this.getCurrentPiece()
	}
	
	getCurrentPiece() {
		const currPiece = this.bag.get(this.order[this.index])
		return currPiece
	}

	makeNewOrder() {
		this.index = 0
		for (let i = this.order.length - 1; i > 0 ; i--) {
			const nbr = randomNbr(i)
			if (i === nbr) {
				continue
			}
			const tmp = this.order[i]
			this.order[i] = this.order[nbr]
			this.order[nbr] = tmp
		}
	}
}
