import { log } from "../debug.js"
import { Bag } from "./Bag.js"
import { ROWS, COLUMNS } from "./gameParams.js"
import { randomNbr } from "./utils.js"
import { Subject } from "../Observer/Subject.js"
import { GameController } from "./GameController.js"
import { LevelTable } from "./gameParams.js"

export class Game extends Subject {
	constructor(keyboard) {
		super()
		this.Bag = new Bag()
		this.field = Array(ROWS)
		this.ctrl = new GameController(keyboard)

		this.running = true

		for (let i = 0; i < ROWS; i++) {
			this.field[i] = Array(COLUMNS).fill(0)
		}

		this.Piece = this.Bag.getNextPiece()
		this.hitList = []
		this.stackHeight = ROWS
		this.hold = null
		this.holdLock = false
		this.lockDown = false
		this.lockDelay = 0
		this.lockPiece = false
		this.linesCleared = 0
		this.frames = 0

		this.level = 1
		this.gravity = 0

		this.garbageQueue = []
	}

	changeLevel() {
		this.level += 1
		if (this.level === 10) {
			this.level = 10
		}
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

	replaceLine(row, replaceLineRow) {
		if (replaceLineRow < 0) {
			this.field[row].fill(0)
			return
		}
		log("Replacing", row, "with", replaceLineRow)
		for (let column = 0; column < COLUMNS; column++) {
			this.field[row][column] = this.field[replaceLineRow][column]
		}
	}

	lineClear() {
		const linesNbr = this.hitList.length
		const start = this.hitList[0]
		
		this.hitList.forEach(line => {
			this.field[line].fill(0)
		})
		var offsetLine = 1
		var row = start
		while (row >= this.stackHeight) {
			if (this.hitList.find(lineNbr => (row - offsetLine) === lineNbr)) {
				offsetLine += 1
				continue
			}
			this.replaceLine(row, row - offsetLine)
			row--
		}
		this.stackHeight += linesNbr
		this.linesCleared = linesNbr
	}

	holdPiece() {
		log("Holding Piece:", this.Piece.toString())
		if (this.hold === null) {
			log("Empty Hold")
			this.hold = this.Piece
			this.newPiece()
		} else {
			log("Hold with:", this.Piece.toString())
			this.Piece.reset()
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

	newPiece() {
		this.holdLock = false
		this.lockPiece = false
		this.lockDown = false
		this.lockDelay = 0
		this.Piece.reset()
		this.Piece = this.Bag.getNextPiece()
	}

	update() {
		log("Current Piece Row:", this.Piece.row)
		const actions = this.ctrl.keyStates()

		this.linesCleared = 0
		
		if (this.stackHeight <= 0) {
			console.log("GameOver")
			this.running = false
		}

		this.Piece.undraw(this.field)

		if (actions.hold === true && this.holdLock === false) {
			this.holdPiece()
			this.holdLock = true
		}
		if (actions.move) {
			this.Piece.move(this.field, actions.move)
		}
		if (actions.rot) {
			this.Piece.rotate(this.field, actions.rot)
			this.lockDelay = 0
		}
		if (actions.hardDrop === true) {
			this.hardDrop()
			this.lockPiece = true
		}

		if (actions.softDrop || this.gravity >= LevelTable[this.level]) {
			if (this.Piece.checkCollision(this.field) === 0) {
				this.Piece.row += 1
				this.lockDelay = 0
			} else {
				this.lockDown = true
			}
			this.gravity = 0
		}

		if (this.lockDown === true) {
			if (this.lockDelay === 30) {
				this.lockPiece = true
			}
			this.lockDelay += 1
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
			this.newPiece()
		}

		this.Piece.draw(this.field)

		this.gravity += 1
	}
}
