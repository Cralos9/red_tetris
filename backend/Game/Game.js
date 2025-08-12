import { log } from "../debug.js"
import { Bag } from "./Bag.js"
import { ROWS, COLUMNS, GAME_EVENTS } from "./gameParams.js"
import { randomNbr } from "./utils.js"
import { LevelTable } from "./gameParams.js"

export class Game {
	constructor(ctrl, eventManager, seed) {
		this.Bag = new Bag(seed)
		this.field = Array(ROWS)
		this.ctrl = ctrl

		this.running = true

		for (let i = 0; i < ROWS; i++) {
			this.field[i] = Array(COLUMNS).fill(0)
		}

		this.Piece = this.Bag.getNextPiece()
		this.hitList = []
		this.stackHeight = ROWS
		this.hold = null
		this.holdLock = false
		this.linesCleared = 0
		this.frames = 0

		this.level = 1
		this.gravity = 0
		this.combo = 0
		this.eventManager = eventManager
	}

	changeLevel() {
		this.level += 1
		if (this.level > 10) {
			this.level = 10
		}
	}

	patternSpin() {
		if (this.Piece.getLastShift() !== GAME_EVENTS.ROTATION) {
			return
		}
		const kicks = [[1,0],[-1,0],[0,-1]]
		const pattern = this.Piece.getCurrPattern()
		for (let i = 0; i < kicks.length; i++) {
			if (this.Piece.checkKicks(this.field, kicks[i], pattern) === true) {
				return (false)
			}
		}
		console.log("Piece Spin")
		return (true)
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
		
		if (this.hitList.length === 0) {
			this.combo = 0
			return
		}

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
		this.combo += 1
		this.stackHeight += linesNbr
		this.linesCleared = linesNbr
	}

	holdPiece() {
		log("Holding Piece:", this.Piece.toString())
		this.resetPiece()
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

	createGarbage(garbageLines) {
		var lineNbr = garbageLines
		const gap = randomNbr(COLUMNS - 1)

		if (this.stackHeight - lineNbr < 0) {
			lineNbr = this.stackHeight // Small fix to the top-out freeze bug
		}
		console.log("Creating Garbage:", lineNbr)
		for (let y = this.stackHeight; y < ROWS; y++) {
			const nextY = y - lineNbr
			this.replaceLine(nextY, y)
		}
		for (let i = 0; i < lineNbr; i++) {
			const y = (ROWS - 1) - i
			const garbage = Array(COLUMNS).fill(8)
			garbage[gap] = 0
			this.field[y] = garbage
		}
		this.stackHeight -= lineNbr
	}

	resetPiece() {
		this.holdLock = false
		this.gravity = 0
		this.Piece.reset()
	}

	update() {
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
		}
		if (actions.hardDrop === true) {
			const dropRow = this.Piece.getRow()
			this.Piece.hardDrop(this.field)
			this.eventManager.notify({
				dropType: GAME_EVENTS.HARD_DROP,
				dropRow: dropRow,
				pieceRow: this.Piece.getRow()
			}, GAME_EVENTS.HARD_DROP)
		}
		if (actions.softDrop) {
			const dropRow = this.Piece.getRow()
			this.Piece.softDrop(this.field)
			this.eventManager.notify({
				dropType: GAME_EVENTS.SOFT_DROP,
				pieceRow: this.Piece.getRow(),
				dropRow: dropRow
			}, GAME_EVENTS.SOFT_DROP)
			this.gravity = 0
		} else if (this.Piece.getCollision() === true || this.gravity >= LevelTable[this.level]) {
			this.Piece.softDrop(this.field)
			this.gravity = 0
		}

		if (this.Piece.getLock() === true) {
			const spin = this.patternSpin()
			this.Piece.draw(this.field)
			this.patternMatch()
			this.lineClear()
			this.eventManager.notify({
				linesCleared: this.linesCleared,
				pieceSpin: spin,
				combo: this.combo,
				level: this.level,
			}, GAME_EVENTS.LINE_CLEAR)
			this.resetPiece()
			this.Piece = this.Bag.getNextPiece()
		}

		this.Piece.draw(this.field)

		this.gravity += 1
	}
}
