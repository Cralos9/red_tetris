import { Piece } from "./Piece.js"
import { randomNbr } from "./utils.js"
import { piecesMap } from "./piecePosition.js"

//function reorder(order) {
//	for (let i = 0; i < arr.length; )
//}

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
			const piece = piecesMap[this.order[i]]
			this.stack.push(new Piece(this.order[i], piece.patterns, piece.skirts, piece.color))
		}
	}

	getNextPiece() {
		this.stack.pop()
		const piece = this.order[randomNbr(this.order.length - 1)]
		this.stack.unshift(new Piece(piece, piecesMap[piece].patterns, piecesMap[piece].skirts, piecesMap[piece].color))
		return (this.stack[this.stack.length - 2])
	}
	
	getCurrentPiece() {
		return (this.stack[this.stack.length - 1])
	}
}
