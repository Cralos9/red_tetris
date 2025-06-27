import { getRandomOrder } from "./utils.js"
import { Pieces } from "./Piece.js"

export class Bag {
	constructor () {
		this.stack = []
		this.order = ["I", "T", "J", "L", "O", "S", "Z"]
		getRandomOrder(this.order)
		for (let i = 0; i < this.order.length; i++) {
			this.stack.push(Pieces[this.order[i]])
		}
		this.rotation = 7
	}

	getNextPiece() {
		if (this.rotation === this.order.length) {
			getRandomOrder(this.order)
			this.rotation = 0
		}
		this.stack.push(Pieces[this.order[this.rotation]])
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
