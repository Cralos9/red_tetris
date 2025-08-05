import { Piece } from "./Piece.js"
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
import { PRNG } from "../PRNG.js"
import { Stack } from "../Stack.js"

export class Bag {
	constructor(seed) {
		this.PRNG = new PRNG(seed)
		this.pieces = {
			"I": new Piece(Icoor, Ioffsets, Colors.BLUE),
			"T": new Piece(Tcoor, JLTSZoffsets, Colors.PURPLE),
			"J": new Piece(Jcoor, JLTSZoffsets, Colors.DARK_BLUE),
			"L": new Piece(Lcoor, JLTSZoffsets, Colors.ORANGE),
			"O": new Piece(Ocoor, Ooffsets, Colors.YELLOW),
			"S": new Piece(Scoor, JLTSZoffsets, Colors.GREEN),
			"Z": new Piece(Zcoor, JLTSZoffsets, Colors.RED),
		}
		this.stack = new Stack()
		this.order = ["I", "T", "J", "L", "O", "S", "Z"]
		this.getRandomOrder()
		for (let i = 0; i < this.order.length; i++) {
			this.stack.push(this.pieces[this.order[i]])
		}
		this.rotation = 7
	}

	getRandomOrder() {
		for (let i = this.order.length - 1; i >= 0; i--) {
			const rNbr = this.PRNG.randRange(0, i);
			const tmp = this.order[i]
			this.order[i] = this.order[rNbr]
			this.order[rNbr] = tmp
		}
	}

	getNextPiece() {
		if (this.rotation === this.order.length) {
			this.getRandomOrder(this.order)
			this.rotation = 0
		}
		this.stack.push(this.pieces[this.order[this.rotation]])
		this.rotation++
		return (this.stack.pop())
	}

	nextPiecesArr() {
		const arr = []
		this.stack.iteration(piece => {
			arr.push(piece.toObject())
		})
		return (arr)
	}
	
	getStack() {
		return (this.stack)
	}
}
