export class GameController {
	constructor() {
		this.holdPiece = false
		this.hardDropF = false
		this.rot = 0
		this.x = 0
		this.y = 0
	}

	move(input) {
		this.x = input
	}

	pushDown(input) {
		this.y = input
	}

	rotate(input) {
		this.rot = input
	}

	hardDrop(input) {
		this.hardDropF = input
	}
	
	holdPiece(input) {
		this.holdPiece = input
	}
}
