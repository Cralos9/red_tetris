import { Game } from "./Game/Game.js"
import { GameController } from "./Game/GameInput.js"
import { Observer } from "./Observer/Observer.js"
import { Events } from "./globalEvents.js"
import { TargetManager } from "./Game/Target.js"
import { ScoreManager } from "./Game/Score.js"

export class Player extends Observer {
	constructor(name, io, id) {
		super()
		this.targets = []
		this.game = null
		this.targetManager = null
		this.score = null
		this.name = name
		this.id = id
		this.io = io
		this.isAlive = true
		this.input = new GameController()
	}

	runGame(roomCode) {
		this.score = new ScoreManager()
		this.targetManager = new TargetManager(this.targets)
		this.game = new Game(this.input, this.targets)
		this.game.addObserver(this.targetManager)
		this.game.addObserver(this.score)
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
				holdPiece: this.game.hold ? this.game.hold.toObject() : 0,
				nextPiece: this.game.Bag.nextPiecesArr(),
				playerId: this.id,
				playerScore: this.score.toObject(),
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
				console.log("Add Player to Targets:", joiner.id)
				this.targets.push(joiner)
				break
			case Events.LEAVE_PLAYER:
				var leaver = state
				console.log("Remove Player:", leaver.id)
				this.targets = this.targets.filter(player => player.id !== leaver.id)
				this.io.emit("boardRemove", {id : leaver.id})
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
