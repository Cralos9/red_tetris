import { log } from "./debug.js"
import { moveHorizontal, moveVertical, rotation } from "./movement.js"
import { COLUMNS, ROWS } from "./gameParams.js"
import { getRotations, getSkirt, compare } from "./utils.js"

export class Piece {
	constructor(pieceCoor, color) {
		this.patterns = pieceCoor
		this.skirts = [getSkirt(pieceCoor[0])]
		for (let i = 0; i < 3; i++) {
			const tmp = getRotations(this.patterns[i]).sort(compare)
			this.skirts.push(getSkirt(tmp))
			this.patterns.push(tmp)
		}
		this.index = 0
		this.row = 0
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

	drawPiece(field, color) {
		const pattern = this.getCurrPattern()

		for (let y = 0; y < pattern.length; y++) {
			const arr = pattern[y]
			if (this.row + arr[1] > -1) {
				field[this.row + arr[1]][this.column + arr[0]] = color
			}
		}
	}

	move(x, y, field) {
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
		this.row += y
		log("Moved Piece Vertical:", this.row)
		log("Moved Piece to column:", this.column)
		moveVertical(0)
		moveHorizontal(0)
	}

	rotate(r) {
		this.index += r + 4
		this.index = this.index % 4
		log("Rotated Piece:", this.index)
		rotation(0)
	}

	getCurrSkirt() {
		return this.skirts[this.index]
	}

	getCurrPattern() {
		return this.patterns[this.index]
	}

	toString() {
		return `Piece Color: ${this.color}`
	}
}
