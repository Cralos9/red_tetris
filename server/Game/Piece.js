import { log } from "../debug.js"
import { COLUMNS, ROWS, Colors } from "./gameParams.js"
import { getRotations, getSkirt, compare, getKicks } from "./utils.js"

export class Piece {
	constructor(pieceCoor, pieceOffsets, color) {
		this.patterns = [pieceCoor]
		this.offsets = pieceOffsets
		this.skirts = [getSkirt(pieceCoor)]
		for (let i = 0; i < 3; i++) {
			const tmp = getRotations(this.patterns[i]).sort(compare)
			this.skirts.push(getSkirt(tmp))
			this.patterns.push(tmp)
		}
		console.log(this.patterns)
		this.index = 0
		this.row = 1
		this.column = 5
		this.color = color
	}

	checkCollision(field) {
		const skirt = this.getCurrSkirt()

		log("Skirt:", skirt)
		for (let i = 0; i < skirt.length; i++) {
			const arr = skirt[i]
			const y = this.row + (arr[1] + 1)
			const x = this.column + arr[0]
			log("Checking:", y, x)
			if (y === ROWS || y > -1 && field[y][x] > 0) {
				return (true)
			}
		}
		return (false)
	}

	drawPiece(field, color) {
		const pattern = this.getCurrPattern()

		for (let y = 0; y < pattern.length; y++) {
			const arr = pattern[y]
			field[this.row + arr[1]][this.column + arr[0]] = color
		}
	
	}

	undraw(field) {
		const y = this.row
		while (this.checkCollision(field) === false) {
			this.row++
		}
		this.drawPiece(field, 0)
		this.row = y
		this.drawPiece(field, 0)
	}

	draw(field) {
		const y = this.row
		while (this.checkCollision(field) === false) {
			this.row++
		}
		this.drawPiece(field, Colors.GHOST)
		this.row = y
		this.drawPiece(field, this.color)
	}

	checkMove(field, move) {
		const pattern = this.getCurrPattern()

		for (let i = 0; i < pattern.length; i++) {
			const x = this.column + pattern[i][0] + move
			const y = this.row + pattern[i][1]
			if (x >= COLUMNS || x < 0 || field[y][x] > 0) {
				return false
			}
		}
		return (true)
	}

	move(field, x) {
		if (this.checkMove(field, x) === false) {
			return
		}
		this.column += x
		log("Moved Piece to column:", this.column)
	}

	checkRotation(field, kick, pattern) {
		for (let k = 0; k < pattern.length; k++) {
			const x = this.column + pattern[k][0] + kick[0]
			const y = this.row + pattern[k][1] + kick[1]
			log("WallKicks: (", y, ", ", x, ")")
			if (x >= COLUMNS || x < 0 || y >= ROWS || y < 0 || field[y][x] > 0) {
				log("Cant do this rotation")
				return (false)
			}
		}
		return (true)
	}

	rotate(field, r) {
		let rot = this.index + r + 4
		rot = rot % 4
		const kicks = getKicks(this.offsets[this.index], this.offsets[rot])
		const pattern = this.patterns[rot]
		if (r === 1 || r === -1) {
			for (let i = 0; i < kicks.length; i++) {
				log("Kick:", kicks[i])
				if (this.checkRotation(field, kicks[i], pattern)) {
					this.row += kicks[i][1]
					this.column += kicks[i][0]
					this.index = rot
					log("Rotated Piece:", this.index)
					break
				}
			}
		}
	}

	getCurrSkirt() {
		return this.skirts[this.index]
	}

	getCurrPattern() {
		return this.patterns[this.index]
	}

	reset() {
		this.row = 1
		this.column = 5
		this.index = 0
	}

	toString() {
		return `Piece Color: ${this.color}`
	}

	toObject() {
		return {
			pattern: this.patterns[0],
			color: this.color
		}
	}
}
