import { log } from "../debug.js"
import { Bag } from "./Bag.js"
import { Field } from "./Field.js"
import { ROWS, COLUMNS } from "./gameParams.js"
import { randomNbr } from "./utils.js"

const coor = [[5,19],[5,18],[5,17],[5,16],[4,17],[6,17],[7,17]]

const compare = (x, y) => {
	for (let i = 0; i < coor.length; i++) {
		if (coor[i][0] === x && coor[i][1] === y) {
			return (true)
		}
	}
	return (false)
}

const formField = (hightestRow) => {
	const field = []

	for (let i = ROWS - 1; i >= 0; i--) {
		let arr = []
		for (let k = 0; k < COLUMNS; k++) {
			if (i >= hightestRow ) {//&& !compare(k, i)) {
				arr[k] = 1
			} else {
				arr[k] = 0
			}
		}
		field[i] = arr
	}
	// console.table(field)
	return (field)
}

export class Game {
	constructor(input, targets) {
		this.Bag = new Bag()
		this.field = new Field()
		this.input = input

		this.running = true

		this.Piece = this.Bag.getNextPiece()
		this.hold = null
		this.holdLock = false
		this.lockDelay = 0
		this.lockPiece = false
		this.frames = 0
	}

	holdPiece() {
		this.Piece.reset()
		log("Holding Piece:", this.Piece.toString())
		if (this.hold === null) {
			log("Empty Hold")
			this.hold = this.Piece
			this.Piece = this.Bag.getNextPiece()
		} else {
			log("Hold with:", this.Piece.toString())
			const tmp = this.Piece
			this.Piece = this.hold
			this.hold = tmp
		}
		log("Holded Piece:", this.hold.toString())
		log("Current Piece:", this.Piece.toString())
	}

	hardDrop() {
		while (this.Piece.checkCollision(this.field) === 0) {
			this.Piece.row++
		}
	}

	update() {
		log("Current Piece Row:", this.Piece.row)
		this.field.linesCleared = 0
		
		if (this.frames % 60 === 0) {
			this.input.softDropPiece(1)
		}

		this.field.draw(this.Piece)

		if (this.input.hold === true && this.holdLock === false) {
			this.holdPiece()
			this.holdLock = true
		}

		if (this.input.hardDrop === true) {
			this.hardDrop()
			this.lockPiece = true
		} else {
			this.Piece.move(this.input.x, this.field)
			this.Piece.rotate(this.field, this.input.rot)
		}

		if (this.field.checkMove(this.Piece, 0, 1) === 0) {
			this.Piece.row += this.input.y
			this.lockDelay = 0
		} else {
			if (this.lockDelay === 30) {
				this.lockPiece = true
			}
			this.lockDelay++
		}

		if (this.lockPiece === true) {
			log("Piece Locked")
			this.field.draw(this.Piece)
			this.field.patternMatch()
			if (this.field.hitArr.length) {
				this.field.lineClears()
			}
			this.holdLock = false
			this.lockPiece = false
			this.lockDelay = 0
			this.Piece.reset()
			this.Piece = this.Bag.getNextPiece()
		}

		this.field.draw(this.Piece)

		if (this.field.stackHeight <= 0) {
			console.log("GameOver")
			this.running = false
		}
		this.frames += 1
	}
}
