import { Piece } from "./models.js"
import { randomNbr } from "./utils.js"

export class Bag {
	constructor () {
		this.bag = new Map()
		this.bag.set("I", new Piece(0, 0, "I"))
		this.bag.set("T", new Piece(0, 0, "T"))
		this.bag.set("J", new Piece(0, 0, "J"))
		this.bag.set("L", new Piece(0, 0, "L"))
		this.bag.set("O", new Piece(0, 0, "O"))
		this.bag.set("S", new Piece(0, 0, "S"))
		this.bag.set("Z", new Piece(0, 0, "Z"))
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
