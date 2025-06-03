import { log } from "./debug.js"
import { moveHorizontal, moveVertical, rotation } from "./movement.js"
import { COLUMNS, ROWS } from "./gameParams.js"
import { getRotations, getSkirt, compare, getKicks } from "./utils.js"

export class Piece {
	constructor(pieceCoor, pieceOffsets, color) {
		this.patterns = pieceCoor
		this.offsets = pieceOffsets
		this.skirts = [getSkirt(pieceCoor[0])]
		for (let i = 0; i < 3; i++) {
			const tmp = getRotations(this.patterns[i]).sort(compare)
			this.skirts.push(getSkirt(tmp))
			this.patterns.push(tmp)
		}
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
				return (1)
			}
		}
		return (0)
	}

	draw(field, color) {
		const pattern = this.getCurrPattern()

		for (let y = 0; y < pattern.length; y++) {
			const arr = pattern[y]
			if (this.row + arr[1] > -1) {
				field[this.row + arr[1]][this.column + arr[0]] = color
			}
		}
	}

	move(x, field) {
		const pattern = this.getCurrPattern()
		let pX

		if (x < 0) {
			pX = pattern[0][0]
			for (let i = 0; i < pattern.length; i++) {
				if (pX !== pattern[i][0]) {
					break
				}
				pX = pattern[i][0]
				const check = this.column + x + pX
				const pY = this.row + pattern[i][1]
				log("H-Check:", pY, check)
				if (check > -1 && pY > -1 && field[pY][check] === 0) {
					x = x
				} else {
					x = 0
					break
				}
			}
		} else {
			pX = pattern[pattern.length - 1][0]
			for (let i = pattern.length - 1; i >= 0; i--) {
				if (pX !== pattern[i][0]) {
					break
				}
				pX = pattern[i][0]
				const check = this.column + x + pX
				const pY = this.row + pattern[i][1]
				log("H+Check", pY, check)
				if (check < COLUMNS && pY > -1 && field[pY][check] === 0) {
					x = x
				} else {
					x = 0
					break
				}
			}
		}
		this.column += x
		log("Moved Piece to column:", this.column)
		moveHorizontal(0)
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
		rotation(0)
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
}
