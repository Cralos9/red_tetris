export class GameController {
	constructor(input) {
		this.input = input
		this.rot = 0
		this.x = 0
		this.y = 0
	}
	
	consume(key) {
		const value = this.input.isPressed(key)
		this.input.set(key, false)
		return (value)
	}

	movePiece(input) {
		this.x = input
	}

	softDropPiece(input) {
		this.y = input
	}

	rotatePiece(input) {
		this.rot = input
	}
}
