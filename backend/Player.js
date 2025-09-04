import Game from "./Game/Game.js"
import TargetManager from "./Game/Target.js"
import ScoreManager from "./Game/Score.js"
import GameController from "./Game/GameController.js"
import { DELTA_TIME } from "./Game/gameParams.js"
import { printArr } from "./debug.js"
import Debug from "debug"
import EventDispatcher from "./Utils/EventDispatcher.js"

export default class Player {
	constructor(name, keybinds, io, id) {
		this.gameInterval = null
		this.game = null
		this.targetManager = null
		this.score = null
		this.eventManager = null
		this.name = name
		this.id = id
		this.io = io
		this.isAlive = true
		this.ctrl = new GameController(keybinds)
		this.inGame = false
		this.log = Debug(`Player:${this.name}`)
	}

	getId() { return (this.id) }
	getName() { return (this.name) }
	getInGame() { return (this.inGame) }
	getTargetManager() { return (this.targetManager) }
	getGameController() { return (this.ctrl) }

	changeLevel() { this.game.changeLevel() }

	startGame(seed, gameManager, roomCode) {
		this.ctrl.reset()
		this.eventManager = new EventDispatcher()
		const gamemode = gameManager.getGamemode()
		this.game = new Game(
			this.ctrl, 
			this.eventManager,
			seed,
			gamemode.createGarbage, 
			gamemode.patternMatch, 
		)
		this.targetManager = new TargetManager(
			this.game.createGarbage.bind(this.game),
			this.eventManager,
			gameManager.getOtherPlayers(this),
			gamemode.gbCalc
		)
		this.score = new ScoreManager(this.eventManager)
		this.log("Targets:", printArr(this.targetManager.getTargets()))
		this.inGame = true
		this.gameInterval = setInterval(() => {
			this.game.update()
			const payload = this.game.toObject()
			payload["playerId"] = this.id
			payload["playerScore"] = this.score.toObject()
			payload["targetManager"] = this.targetManager.toObject(),
			this.io.to(roomCode).emit('game', payload)
			if (this.game.running === false) {
				this.log("Lost Game")
				gameManager.handleLoss(this)
				this.inGame = false
				clearInterval(this.gameInterval)
			}
		}, DELTA_TIME)
	}

	stopGame() {
		if (this.inGame === true) {
			this.game.running = false
		}
	}

	toString() {
		return `${this.name}`.green
	}

	toObject() {
		return {
			playerName: this.name
		}
	}
}
