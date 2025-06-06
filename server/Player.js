import { Game } from "./Game.js"
import { GameController } from "./GameInput.js"

export class Player {
	constructor(name, socket) {
		this.name = name
		this.socket = socket
		this.input = new GameController()
		this.game = new Game(this.input)
	}

	runGame() {
		const game = setInterval(() => {
			this.game.update()
			console.table(this.game.field)
			this.socket.emit(this.name, {field: this.game.field})
		}, 20)
	}

	toString() {
		return `Player ${this.name}`
	}
}
