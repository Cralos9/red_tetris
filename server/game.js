import { getMoves, holdPiece, hardDrop } from "./movement.js"
import { log } from "./debug.js"
import { Bag } from "./Bag.js"
import { ROWS, COLUMNS } from "./gameParams.js"

export class Game {
	constructor() {
		this.Bag = new Bag()
		this.field = []

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
		this.Piece.draw(this.field, 0)
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

	update() {
		log("Current Piece Row:", this.Piece.row)
		log("Stack Height:", this.stackHeight)
		const input = getMoves()
		
		if (input.hold === true && this.holdLock === false) {
			this.holdPiece()
			this.holdLock = true
			holdPiece(false)
		}
		if (this.frames === 60) {
			input.y = 1
			this.frames = 0
		}
		if (this.stackHeight < 0) {
			console.log("Game Over")
			this.running = false
			return
		}
		if (this.Piece.checkCollision(this.field)) {
			log("Collision")
			this.updateStackHeight()
			this.patternMatch()
			this.lineClear()
			this.holdLock = false
			this.Piece.row = 0
			this.Piece.column = 5
			this.Piece.index = 0
			this.Piece = this.Bag.getNextPiece()
		} else {
			this.Piece.draw(this.field, 0)
			if (input.hardDrop === true) {
				this.Piece.hardDrop(this.field)
				hardDrop(false)
			} else {
				this.Piece.move(input.x, input.y, this.field)
				this.Piece.rotate(input.r)
			}
			this.Piece.draw(this.field, this.Piece.color)
		}
		this.frames++
	}
}
