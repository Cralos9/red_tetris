import Piece from "./Piece.js"
import { 
	Icoor,
	Tcoor,
	Jcoor,
	Lcoor,
	Ocoor,
	Scoor,
	Zcoor,
	COLORS
} from "../../common.js"
import {
	JLTSZoffsets,
	Ioffsets,
	Ooffsets,
} from "./gameParams.js"
import PRNG from "../Utils/PRNG.js"
import Stack from "../Utils/Stack.js"
import Debug from "debug"

export default class Bag {
	constructor(seed) {
		this.PRNG = new PRNG(seed)
		this.pieces = {
			"I": new Piece(Icoor, Ioffsets, COLORS.BLUE),
			"T": new Piece(Tcoor, JLTSZoffsets, COLORS.PURPLE),
			"J": new Piece(Jcoor, JLTSZoffsets, COLORS.DARK_BLUE),
			"L": new Piece(Lcoor, JLTSZoffsets, COLORS.ORANGE),
			"O": new Piece(Ocoor, Ooffsets, COLORS.YELLOW),
			"S": new Piece(Scoor, JLTSZoffsets, COLORS.GREEN),
			"Z": new Piece(Zcoor, JLTSZoffsets, COLORS.RED),
		}
		this.stack = new Stack()
		this.order = ["I", "T", "J", "L", "O", "S", "Z"]
		this.rotation = 0
		this.log = Debug("Bag")
		this.getRandomOrder()
		this.log(this.order)
		for (let i = 0; i < this.order.length; i++) {
			this.stack.push(this.pieces[this.order[i]])
		}
		this.getRandomOrder()
		this.log(this.order)
	}

	getRandomOrder() {
		for (let i = this.order.length - 1; i >= 0; i--) {
			const rNbr = this.PRNG.randRange(0, i);
			const tmp = this.order[i]
			this.order[i] = this.order[rNbr]
			this.order[rNbr] = tmp
		}
		this.log(this.order)
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
