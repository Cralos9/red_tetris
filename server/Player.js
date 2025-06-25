import { Game } from "./Game.js"
import { GameController } from "./GameInput.js"
import { Observer } from "./Observer.js"
import { Events } from "./globalEvents.js"
import { log } from "./debug.js"

export class Player extends Observer {
	constructor(name, io, id) {
		super()
		this.targets = []
		this.game = null
		this.name = name
		this.id = id
		this.io = io
		this.isAlive = true
		this.input = new GameController()
	}

	runGame(roomCode) {
		this.game = new Game(this.input, this.targets)
		const delay = 16 // Close to 60 FPS
		const interval = setInterval(() => {
			this.game.update()
			this.input.movePiece(0)
			this.input.softDropPiece(0)
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
		}, delay)
	}

	update(state, event) {
		switch (event) {
			case Events.JOIN_PLAYER:
				var joiner = state
				log("Add Player to Targets:", joiner.id)
				this.targets.push(joiner)
				break
			case Events.LEAVE_PLAYER:
				var leaver = state
				console.log("Remove Player:", leaver.id)
				this.targets = this.targets.filter(player => player.id !== leaver.id)
				break
			default:
				break
		}
	}

	stopGame() {
		this.game.running = false
	}

	toString() {
		return `Player ${this.id}, ${this.name}`
	}
}
