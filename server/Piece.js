export class Piece {
	constructor(piece, patterns) {
		this.piece = piece
		this.patterns = patterns
		this.pattern = 0
		this.row = 2
	}

	rotateRight() {
		this.pattern += 1
	}

	rotateLeft() {
		this.pattern -= 1
	}

	getCurrPattern() {
		return this.patterns[this.pattern]
	}

	toString() {
		return `Piece: ${this.piece}`
	}
}
