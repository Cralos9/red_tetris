import { Game } from "./Game/Game.js"
import { Keyboard } from "./Game/Input.js"
import { TargetManager } from "./Game/Target.js"
import { ScoreManager } from "./Game/Score.js"
import { GameController } from "./Game/GameController.js"
import { DELTA_TIME } from "./Game/gameParams.js"

export class Player {
	constructor(name, keybinds, io, id) {
		this.targets = []
		this.gameInterval = null
		this.game = null
		this.targetManager = null
		this.score = null
		this.room = null
		this.name = name
		this.id = id
		this.io = io
		this.isAlive = true
		this.keybinds = keybinds
		this.keyboard = new Keyboard()
	}

	setRoom(room) {
		this.room = room
	}

	changeLevel() {
		this.game.changeLevel()
	}

	runGame(roomCode) {
		this.score = new ScoreManager()
		this.targetManager = new TargetManager(this.targets)
		this.game = new Game(new GameController(this.keyboard, this.keybinds))
		this.game.addObserver(this.targetManager)
		this.game.addObserver(this.score)
		this.gameInterval = setInterval(() => {
			this.game.update()
			//console.table(this.game.field)
			this.io.to(roomCode).emit('game', {
				field: this.game.field,
				linesCleared: this.game.linesCleared,
				holdPiece: this.game.hold ? this.game.hold.toObject() : 0,
				nextPiece: this.game.Bag.nextPiecesArr(),
				level: this.game.level,
				playerId: this.id,
				playerScore: this.score.toObject(),
				running: this.game.running,
			})
			if (this.game.running === false) {
				this.stopGame()
			}
		}, DELTA_TIME)
	}

	stopGame() {
		clearInterval(this.gameInterval)
		this.room.handleGame(this)
	}

	toObject() {
		return {
			playerName: this.name
		}
	}
}
