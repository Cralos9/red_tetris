import { log } from "./debug.js"
import { Bag } from "./Bag.js"
import { ROWS, COLUMNS, SPEED } from "./gameParams.js"

export class Game {
	constructor(input) {
		this.Bag = new Bag()
		this.field = []
		this.input = input

		this.running = true

		for (let i = 0; i < ROWS; i++) {
			let arr = []
			for (let j = 0; j < COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}

		this.Piece = this.Bag.getNextPiece()
		this.frames = 0
		this.hitList = []
		this.stackHeight = ROWS
		this.hold = 0
		this.holdLock = false
		this.lockDelay = 0
		this.lockPiece = false
	}

	patternMatch() {
		for (let y = ROWS - 1; y >= 0; y--) {
			let count = 0
			for (let x = 0; x < COLUMNS; x++) {
				if (this.field[y][x] > 0) {
					count++
				}
			}
			if (count === this.field[y].length) {
				this.hitList.push(y)
			}
		}
		log("Marked Lines:", this.hitList)
	}

	lineClear() {
		const linesNbr = this.hitList.length
		const start = this.hitList[0]
		
		this.hitList.forEach(line => {
			for (let i = 0; i < this.field[line]; i++) {
				this.field[line][i] = 0
			}
		})
		log("Start:", start, this.stackHeight)
		for (let y = start; y >= this.stackHeight; y--) {
			log("Clearing Line:", y)
			for (let x = 0; x < this.field[y].length; x++) {
				this.field[y][x] = this.field[y - linesNbr][x]
			}
		}
		this.stackHeight += linesNbr
		this.hitList = []
	}

	updateStackHeight() {
		const pattern = this.Piece.getCurrPattern()
		let lowerY = pattern[0][1]

		for (let i = 0; i < pattern.length; i++) {
			if (lowerY > pattern[i][1]) {
				lowerY = pattern[i][1]
			}
		}
		const provHeight = this.Piece.row + lowerY
		if (this.stackHeight > provHeight) {
			this.stackHeight = provHeight
		}
	}

	holdPiece() {
		this.Piece.reset()
		log("Holding Piece:", this.Piece.toString())
		if (this.hold === 0) {
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
		log("Stack Height:", this.stackHeight)
		
		// Undraw Piece
		this.Piece.draw(this.field, 0)
		if (this.frames === 60) {
			this.input.y = 1 * SPEED
			this.frames = 0
		}

		if (this.input.hold === true && this.holdLock === false) {
			this.holdPiece()
			this.holdLock = true
			this.input.holdPiece(false)
		}
		if (this.input.hardDrop === true) {
			this.hardDrop()
			this.lockPiece = true
			this.input.hardDropPiece(false)
		} else {
			this.Piece.move(this.input.x, this.field)
			this.Piece.rotate(this.field, this.input.rot)
			this.input.movePiece(0)
			this.input.rotatePiece(0)
		}

		if (this.Piece.checkCollision(this.field) === 0) {
			this.Piece.row += this.input.y
			this.input.pushDownPiece(0)
		} else {
			if (this.lockDelay === 30) {
				this.lockPiece = true
			}
			this.lockDelay++
		}

		if (this.lockPiece === true) {
			log("Piece Locked")
			this.Piece.draw(this.field, this.Piece.color)
			this.updateStackHeight()
			this.patternMatch()
			this.lineClear()
			this.holdLock = false
			this.lockPiece = false
			this.lockDelay = 0
			this.Piece.reset()
			this.Piece = this.Bag.getNextPiece()
		}

		// Draw Current Piece
		this.Piece.draw(this.field, this.Piece.color)

		if (this.stackHeight <= 0) {
			console.log("GameOver")
			this.running = false
		}

		this.frames++
	}
}
