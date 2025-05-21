export class Player {
	constructor(name) {
		this.name = name
	}

	toString() {
		return `Player: ${this.name}`
	}
}

export class Piece {
	constructor(height, width, position, piece) {
		this.height = height
		this.width = width
		this.piece = piece
		this.position = position
	}

	toString() {
		return `Piece: ${this.piece}`
	}
}

export class Game {
	constructor(columns, rows) {
		this.COLUMNS = columns
		this.ROWS = rows
		this.field = []

		for (let i = 0; i < this.ROWS; i++) {
			let arr = []
			for (let j = 0; j < this.COLUMNS; j++) {
				arr[j] = 0
			}
			this.field[i] = arr
		}
	}
}
