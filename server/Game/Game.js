import { Bag } from "./Bag.js"
import { Field } from "./Field.js"
import { ROWS, COLUMNS } from "./gameParams.js"
import { getKicks } from "./utils.js"

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
	constructor(input) {
		this.Bag = new Bag()
		this.field = new Field()
		this.input = input
		this.row = 1
		this.column = 5
		this.running = true
		this.Piece = this.Bag.getNextPiece()
		this.hold = null
		this.holdLock = false
		this.lockDelay = 0
		this.lockPiece = false
		this.frames = 0
	}

	holdPiece() {
		this.row = 1
		this.column = 5
		if (this.hold === null) {
			this.hold = this.Piece
			this.Piece = this.Bag.getNextPiece()
		} else {
			const tmp = this.Piece
			this.Piece = this.hold
			this.hold = tmp
		}
	}

	hardDrop() {
		while (this.field.checkMove(this.Piece, this.column, this.row + 1) === true) {
			this.row++
		}
	}

	movePiece() {
		const newRow = this.row + this.input.y
		const newColumn = this.column + this.input.x
		if (this.field.checkDrop(this.Piece, this.column, newRow) === true) {
			this.row = newRow
		}
		if (this.field.checkMove(this.Piece, newColumn, this.row) === true) {
			this.column = newColumn
		}
	}

	rotatePiece() {
		const nextPiece = this.Piece.nextRotation(this.input.rot)
		const kicks = getKicks(this.Piece.offset, nextPiece.offset)
		
		for (let i = 0; i < kicks.length; i++) {
			const newColumn = this.column + kicks[i][0]
			const newRow = this.row + kicks[i][1]
			if (this.field.checkMove(nextPiece, newColumn, newRow) === true) {
				this.row = newRow
				this.column = newColumn
				this.Piece = nextPiece
				return
			}
		}
	}

	update() {
		this.field.linesCleared = 0
		
		if (this.frames % 60 === 0) {
			this.input.softDropPiece(1)
		}

		this.field.undraw(this.Piece, this.column, this.row)

		if (this.input.hold === true && this.holdLock === false) {
			this.holdPiece()
			this.holdLock = true
		}

		if (this.input.hardDrop === true) {
			this.hardDrop()
			this.lockPiece = true
		} else if (this.input.x || this.input.y) {
			this.movePiece()
		} else if (this.input.rot) {
			this.rotatePiece()
		}

		if (this.field.checkDrop(this.Piece, this.column, this.row + 1) === true) {
			this.lockDelay = 0
		} else {
			if (this.lockDelay === 30) {
				this.lockPiece = true
			}
			this.lockDelay++
		}

		if (this.lockPiece === true) {
			this.field.draw(this.Piece, this.column, this.row, this.Piece.color)
			this.field.patternMatch()
			if (this.field.hitArr.length) {
				this.field.lineClears()
			}
			this.holdLock = false
			this.lockPiece = false
			this.lockDelay = 0
			this.row = 1
			this.column = 5
			this.Piece = this.Bag.getNextPiece()
		}

		this.field.draw(this.Piece, this.column, this.row)

		if (this.field.stackHeight <= 0) {
			console.log("GameOver")
			this.running = false
		}
		this.frames += 1
	}
}
