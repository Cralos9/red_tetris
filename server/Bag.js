import { Piece } from "./Piece.js"
import { randomNbr } from "./utils.js"
import { pieces, skirts } from "./piecePosition.js"

export class Bag {
	constructor () {
		this.bag = new Map()
		this.bag.set("I", new Piece("I", pieces[0], skirts[0]))
		this.bag.set("T", new Piece("T", pieces[1], skirts[1]))
		this.bag.set("J", new Piece("J", pieces[2], skirts[2]))
		this.bag.set("L", new Piece("L", pieces[3], skirts[3]))
		this.bag.set("O", new Piece("O", pieces[4], skirts[4]))
		this.bag.set("S", new Piece("S", pieces[5], skirts[5]))
		this.bag.set("Z", new Piece("Z", pieces[6], skirts[6]))
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
