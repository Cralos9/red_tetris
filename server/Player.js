import { Game } from "./Game.js"
import { GameController } from "./GameInput.js"

export class Player {
	constructor(name, io, id) {
		this.name = name
		this.id = id
		this.io = io
		this.input = new GameController()
		this.game = new Game(this.input)
		this.interval = 0
	}

	runGame(roomCode) {
		this.interval = setInterval(() => {
			this.game.update()
			//console.table(this.game.field)
			this.io.to(roomCode).emit('game', {field: this.game.field, playerId: this.id, running: this.game.running})
		}, 20)
	}

	stopGame() {
		clearInterval(this.interval)
	}

	toString() {
		return `Player ${this.id}, ${this.name}`
	}
}
