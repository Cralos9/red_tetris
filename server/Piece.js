import { log } from "./debug.js"
import { moveHorizontal, moveVertical, rotation } from "./movement.js"
import { COLUMNS } from "./gameParams.js"

export class Piece {
	constructor(piece, patterns, skirts, color) {
		this.piece = piece
		this.patterns = patterns
		this.skirts = skirts
		this.index = 0
		this.height = 0
		this.row = -1
		this.column = 5
		this.color = color
	}

	checkCollision(field, ROWS) {
		const skirt = this.getCurrSkirt()

		console.log("Skirt:", skirt)
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
			//log(y, arr)
			if (this.row + arr[1] > -1) {
				field[this.row + arr[1]][this.column + arr[0]] = color
			}
		}
	}

	validMove(start, end, inc) {
		const pattern = this.getCurrPattern()
		let i = start

		while (i < end) {
			i += inc
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
				console.log("H-Check:", pY, check)
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
				console.log("H+Check", pY, check)
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
		this.index += r
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
		return `Piece: ${this.piece}`
	}
}
