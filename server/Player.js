import { Game } from "./Game.js"
import { GameController } from "./GameInput.js"

export class Player {
	constructor(name, socket) {
		this.name = name
		this.socket = socket
		this.input = new GameController()
		this.game = new Game(this.input)
		this.interval = 0
	}

	runGame() {
		this.interval = setInterval(() => {
			this.game.update()
			//console.table(this.game.field)
			this.socket.emit('game', {field: this.game.field, player: this.name, running: this.game.running})
		}, 20)
	}

	stopGame() {
		clearInterval(this.interval)
	}

	toString() {
		return `Player ${this.name}`
	}
}
