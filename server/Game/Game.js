import { log } from "../debug.js"
import { Bag } from "./Bag.js"
import { ROWS, COLUMNS } from "./gameParams.js"
import { randomNbr } from "./utils.js"
import { Subject } from "../Observer/Subject.js"

export class Game extends Subject {
	constructor(input) {
		super()
		this.Bag = new Bag()
		this.field = Array(ROWS)
		this.input = input

		this.running = true

		for (let i = 0; i < ROWS; i++) {
			this.field[i] = Array(COLUMNS).fill(0)
		}

		this.Piece = this.Bag.getNextPiece()
		this.hitList = []
		this.stackHeight = ROWS
		this.hold = null
		this.holdLock = false
		this.lockDelay = 0
		this.lockPiece = false
		this.linesCleared = 0
		this.frames = 0

		this.garbageQueue = []
	}

	patternMatch() {
		this.hitList = []
		for (let y = ROWS - 1; y >= 0; y--) {
			let count = 0
			for (let x = 0; x < COLUMNS; x++) {
				if (this.field[y][x] > 0) {
					count++
					this.stackHeight = y
				}
			}
			if (count === this.field[y].length) {
				this.hitList.push(y)
			}
		}
		log("Stack:", this.stackHeight)
		log("Marked Lines:", this.hitList)
	}

	lineClear() {
		const linesNbr = this.hitList.length
		const start = this.hitList ? this.hitList[0] : 0
		
		this.hitList.forEach(line => {
			this.field[line].fill(0)
		})
		for (let y = start; y >= this.stackHeight; y--) {
			log("Moving Line,", y - linesNbr, "to,", y)
			const nextY = y - linesNbr
			for (let x = 0; x < this.field[y].length; x++) {
				if (nextY > -1) {
					this.field[y][x] = this.field[nextY][x]
				} else {
					this.field[y][x] = 0
				}
			}
		}
		this.stackHeight += linesNbr
		this.linesCleared = linesNbr
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
		const dropRow = this.Piece.row
		while (this.Piece.checkCollision(this.field) === 0) {
			this.Piece.row++
		}
		this.notify({
			dropRow: dropRow,
			pieceRow: this.Piece.row
		}, "HARD_DROP")
	}

	createGarbage() {
		const lineNbr = this.garbageQueue.shift()
		const gap = randomNbr(COLUMNS - 1)

		for (let y = this.stackHeight; y < ROWS; y++) {
			const nextY = y - lineNbr
			for (let x = 0; x < COLUMNS; x++) {
				if (nextY > -1) {
					this.field[nextY][x] = this.field[y][x]
				}
			}
		}
		for (let i = 0; i < lineNbr; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			garbage[gap] = 0
			this.field[y] = garbage
		}
	}

	update() {
		log("Current Piece Row:", this.Piece.row)
		this.linesCleared = 0
		
		if (this.frames % 60 === 0) {
			this.input.softDropPiece(1)
		}

		this.Piece.undraw(this.field)

		if (this.input.hold === true && this.holdLock === false) {
			this.holdPiece()
			this.holdLock = true
		}

		if (this.input.hardDrop === true) {
			this.hardDrop()
			this.lockPiece = true
		} else if (this.input.x || this.input.rot) {
			this.Piece.move(this.field, this.input.x)
			this.Piece.rotate(this.field, this.input.rot)
			this.lockDelay = 0
		}

		if (this.Piece.checkCollision(this.field) === 0) {
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
			this.Piece.draw(this.field)
			this.patternMatch()
			if (this.hitList.length) {
				this.lineClear()
			}
			this.notify(this.linesCleared, "LINE_CLEAR")
			if (this.garbageQueue.length) {
				this.createGarbage()
			}
			this.holdLock = false
			this.lockPiece = false
			this.lockDelay = 0
			this.Piece.reset()
			this.Piece = this.Bag.getNextPiece()
		}

		this.Piece.draw(this.field)

		if (this.stackHeight <= 0) {
			console.log("GameOver")
			this.running = false
		}
		this.frames += 1
	}
}
