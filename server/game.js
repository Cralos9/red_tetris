import { getMoves } from "./movement.js"
import { log } from "./debug.js"
import { Bag } from "./Bag.js"
import { ROWS, COLUMNS } from "./gameParams.js"

const SPEED = 1;

export class Game {
	constructor(socket) {
		this.Bag = new Bag()
		this.field = []

		this.running = true
		this.socket = socket

		for (let i = 0; i < ROWS; i++) {
			let arr = []
			for (let j = 0; j < COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}

		this.Piece = this.Bag.getCurrentPiece()
		//const piece = piecesMap["T"]
		//this.Piece = new Piece("T", piece.patterns, piece.skirts)
		log(this.Piece.toString())
		this.time = Date.now()
		this.hitList = []
		this.stackHeight = ROWS
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

	update() {
		log("Current Piece Row:", this.Piece.row)
		log("Stack Height:", this.stackHeight)
		
		if (this.stackHeight < 0) {
			console.log("Game Over")
			this.running = false
			return
		}
		if (this.Piece.checkCollision(this.field, ROWS)) {
			log("Collision")
			this.updateStackHeight()
			this.patternMatch()
			this.lineClear()
			this.Piece.row = -1
			this.Piece.column = 5
			this.Piece = this.Bag.getNextPiece()
			console.log(this.Piece.toString())
			//this.socket.emit('color', this.Piece.color)
		} else {
			this.Piece.drawPiece(this.field, 0)
			const moves = getMoves()
			if (Date.now() - this.time >= 1000 / SPEED) {
				moves.y = 1
				this.time = Date.now()
			}
			this.Piece.move(moves.x, moves.y, this.field)
			this.Piece.rotate(moves.r)
			this.Piece.drawPiece(this.field, this.Piece.color)
		}
		this.socket.emit('action', {field: this.field})
	}
}
