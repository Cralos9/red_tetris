export class Piece {
	constructor(piece, patterns) {
		this.piece = piece
		this.patterns = patterns
		this.pattern = 0
		this.height = this.getHeight()
		this.row = 0
		this.column = 5
	}

	checkCollision(field, ROWS) {
		const checkRow = this.row + 1
		const pattern = this.getCurrPattern()
		let line = 0

		if (checkRow === ROWS) {
			console.log("Collision")
			return (1)
		}
		//console.log("Checking Row:", this.row + 1)
		for (let y = 0; y < pattern.length; y++) {
			if (pattern[y].find(element => element === 1)) {
				line = y
			}
		}

		//console.log("Last Line:", line)
		for (let x = 0; x < pattern[line].length; x++) {
			if (pattern[line][x] === 1 && field[checkRow][this.column + x] === 1) {
				console.log("Piece Collision")
				return (1)
			}
		}
		return (0)
	}

	drawPiece(field, ROWS, drow, color) {
		const pattern = this.getCurrPattern()

		for (let row = 0; row < pattern.length; row++) {
			const rIndex = drow + row
			const pieceLength = pattern[row].length
			if (rIndex > -1 && rIndex < ROWS) {
				for (let column = 0; column < pieceLength; column++) {
					if (pattern[row][column] === 1) {
						const cIndex = this.column + column
						field[rIndex][cIndex] = color
					}
				}
			}
		}
	}

	getHeight() {
		const pattern = this.getCurrPattern()
		let height;

		for (let i = 0; i < pattern.length; i++) {
			if (pattern[i].find(element => element === 1)) {
				height = i
			}
		}
		return (height)
	}

	moveRight() {
		console.log("Moved Right")
		this.column++
	}

	moveLeft() {
		console.log("Moved Left")
		this.column--
	}

	rotateRight() {
		this.pattern += 1
		this.pattern = this.pattern % 2
		//console.log("Before height:", this.height)
		const height = Math.abs(this.height - this.getHeight())
		this.row = this.row + height
		this.height = height
		//console.log("After height:", this.height)
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
