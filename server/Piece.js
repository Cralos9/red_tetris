export class Piece {
	constructor(piece, patterns) {
		this.piece = piece
		this.patterns = patterns
		this.pattern = 0
		this.row = 0
	}

	checkCollision(field, ROWS, column) {
		const checkRow = this.row + 1
		const pattern = this.getCurrPattern()
		let line = 0

		if (checkRow === ROWS) {
			console.log("Collision")
			return (1)
		}
		console.log("Checking Row:", this.row + 1)
		for (let y = 0; y < pattern.length; y++) {
			if (pattern[y].find(element => element === 1)) {
				line = y
			}
		}

		console.log("Last Line:", line)
		for (let x = 0; x < pattern[line].length; x++) {
			if (pattern[line][x] === 1 && field[checkRow][column + x] === 1) {
				console.log("Piece Collision")
				return (1)
			}
		}
		return (0)
	}

	drawPiece(field, ROWS, drow, dcolumn, color) {
		const pattern = this.getCurrPattern()

		for (let row = 0; row < pattern.length; row++) {
			const rIndex = drow + row
			const pieceLength = pattern[row].length
			if (rIndex > -1 && rIndex < ROWS) {
				for (let column = 0; column < pieceLength; column++) {
					if (pattern[row][column] === 1) {
						const cIndex = dcolumn + column
						field[rIndex][cIndex] = color
					}
				}
			}
		}
	}

	rotateRight() {
		this.pattern += 1
		this.pattern = this.pattern % 4
		console.log("After rotation", this.pattern)
	}

	rotateLeft() {
		this.pattern -= 1
		this.pattern = this.pattern % 4
	}

	getCurrPattern() {
		return this.patterns[this.pattern]
	}

	toString() {
		return `Piece: ${this.piece}`
	}
}
