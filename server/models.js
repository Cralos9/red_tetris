export class Player {
	constructor(name) {
		this.name = name
	}

	toString() {
		return `Player: ${this.name}`
	}
}

export class Piece {
	constructor(height, width, piece) {
		this.height = height
		this.width = width
		this.piece = piece
	}

	toString() {
		return `Piece: ${this.piece}`
	}
}

// Not Implemented
//class Game {
//}
