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
		this.inGame = false
	}

	setRoom(room) {
		this.room = room
	}

	changeLevel() {
		this.game.changeLevel()
	}

	runGame() {
		this.inGame = true
		this.score = new ScoreManager()
		this.targetManager = new TargetManager(this.targets)
		this.game = new Game(new GameController(this.keyboard, this.keybinds))
		this.game.addObserver(this.targetManager)
		this.game.addObserver(this.score)
		this.gameInterval = setInterval(() => {
			this.game.update()
			//console.table(this.game.field)
			this.io.to(this.room.getCode()).emit('game', {
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
				this.room.handleGame(this)
				this.inGame = false
				clearInterval(this.gameInterval)
			}
		}, DELTA_TIME)
	}

	stopGame() {
		this.game.running = false // Temporary Flag (Helps to Test the Game)
	}

	toObject() {
		return {
			playerName: this.name
		}
	}
}
