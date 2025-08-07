import { Game } from "./Game/Game.js"
import { Keyboard } from "./Game/Input.js"
import { TargetManager } from "./Game/Target.js"
import { ScoreManager } from "./Game/Score.js"
import { GameController } from "./Game/GameController.js"
import { DELTA_TIME } from "./Game/gameParams.js"
import { playerDebug } from "./debug.js"

export class Player {
	constructor(name, keybinds, io, id) {
		this.gameInterval = null
		this.game = null
		this.targetManager = null
		this.score = null
		this.name = name
		this.id = id
		this.io = io
		this.isAlive = true
		this.keybinds = keybinds
		this.keyboard = new Keyboard()
		this.inGame = false
	}

	getId() { return (this.id) }
	getName() { return (this.name) }
	getInGame() { return (this.inGame) }
	getTargetManager() { return (this.targetManager) }

	setIngame(flag) {
		this.inGame = flag
	}

	changeLevel() {
		this.game.changeLevel()
	}

	startGame(seed, gameManager, roomCode) {
		this.keyboard.reset()
		this.game = new Game(new GameController(this.keyboard, this.keybinds), seed)
		this.targetManager = new TargetManager(this.game.createGarbage.bind(this.game),
			gameManager.getOtherPlayers(this))
		this.score = new ScoreManager()
		this.game.addObserver(this.targetManager)
		this.game.addObserver(this.score)
		this.inGame = true
		playerDebug.printTargets(this)
		this.gameInterval = setInterval(() => {
			this.game.update()
			//console.table(this.game.field)
			this.io.to(roomCode).emit('game', {
				field: this.game.field,
				linesCleared: this.game.linesCleared,
				holdPiece: this.game.hold ? this.game.hold.toObject() : 0,
				nextPiece: this.game.Bag.nextPiecesArr(),
				level: this.game.level,
				targetManager: this.targetManager.toObject(),
				playerId: this.id,
				playerScore: this.score.toObject(),
				running: this.game.running,
			})
			if (this.game.running === false) {
				playerDebug.playerlog(this, "Lost the Game")
				gameManager.handleLoss(this)
				this.inGame = false
				clearInterval(this.gameInterval)
			}
		}, DELTA_TIME)
	}

	stopGame() {
		if (this.inGame === true) {
			this.game.running = false // Temporary Flag (Helps to Test the Game)
		}
	}

	toString() {
		return `${this.name}`
	}

	toObject() {
		return {
			playerName: this.name
		}
	}
}
