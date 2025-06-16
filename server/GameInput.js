export class GameController {
	constructor() {
		this.hold = false
		this.hardDrop = false
		this.rot = 0
		this.x = 0
		this.y = 0
	}

	movePiece(input) {
		this.x = input
	}

	pushDownPiece(input) {
		this.y = input
	}

	rotatePiece(input) {
		this.rot = input
	}

	hardDropPiece(input) {
		this.hardDrop = input
	}
	
	holdPiece(input) {
		this.hold = input
	}
}
