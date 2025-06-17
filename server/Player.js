import { Game } from "./Game.js"
import { GameController } from "./GameInput.js"

export class Player {
	constructor(name, io, id) {
		this.name = name
		this.id = id
		this.io = io
		this.input = new GameController()
		this.game = 0
	}

	runGame(roomCode) {
		this.game = new Game(this.input)
		const delay = 16 // Close to 60 FPS
		let frames = 0
		const interval = setInterval(() => {
			if (frames === 60) {
				this.input.pushDownPiece(1)
				frames = 0
			}
			this.game.update()
			this.input.movePiece(0)
			this.input.pushDownPiece(0)
			this.input.rotatePiece(0)
			this.input.hardDropPiece(false)
			this.input.holdPiece(false)
			//console.table(this.game.field)
			this.io.to(roomCode).emit('game', {
				field: this.game.field,
				linesCleared: this.game.linesCleared,
				holdPiece: this.game.hold ? {hold: this.game.hold.patterns[0], color: this.game.hold.color} : 0,
				nextPiece: this.game.Bag.nextPiecesArr(),
				playerId: this.id,
				running: this.game.running,
			})
			if (this.game.running === false) {
				clearInterval(interval)
			}
			frames++
		}, delay)
	}

	stopGame() {
		this.game.running = false
	}

	toString() {
		return `Player ${this.id}, ${this.name}`
	}
}
