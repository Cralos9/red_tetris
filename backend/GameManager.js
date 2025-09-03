import { LEVEL_INTERVAL } from "./Game/gameParams.js";
import { printArr } from "./debug.js";
import { GAMEMODES } from "../common.js"
import { CreateGarbage42, CreateGarbageTetris } from "./Game/Strategy/CreateGarbage.js";
import { PatternMatch42, PatternMatchTetris } from "./Game/Strategy/PatternMatch.js";
import { GarbageCalculation42, GarbageCalculationTetris } from "./Game/Strategy/GarbageCalculation.js";

export default class GameManager {
	constructor(room, gamePlayers) {
		this.room = room
		this.players = gamePlayers
		this.leaderboard = []
		this.level = 1
		this.levelInterval = null
		this.seed = Date.now()
		this.log = this.room.getLog().extend("GameManager")
		this.strats = {
			[GAMEMODES.Tetris]: {
				createGarbage: new CreateGarbageTetris(),
				patternMatch: new PatternMatchTetris(),
				gbCalc: new GarbageCalculationTetris()
			},
			[GAMEMODES.Base]: {
				createGarbage: new CreateGarbage42(),
				patternMatch: new PatternMatch42(),
				gbCalc: new GarbageCalculation42()
			}
		}
	}

	getPlayers() { return (this.players) }
	getSeed() { return (this.seed) }
	getLeaderboard() { return (this.leaderboard) }
	getOtherPlayers(filterPlayer) {
		return (this.players.filter(player => player !== filterPlayer))
	}
	getGamemode() { return (this.strats[this.room.getGamemode()]) }

	startGame() {
		this.log("Players:", printArr(this.players))
		this.log("Seed: %d", this.seed)
		this.players.forEach(player => {
			player.stopGame()
			player.startGame(this.seed, this, this.room.getCode())
		})

		this.levelInterval = setInterval(() => {
			const now = new Date().toLocaleTimeString();
			this.log(`[${now}] Changing Level`)
			this.players.forEach(player => {
				player.game.changeLevel(this.level)
			})
			if (this.level === 10) {
				clearInterval(this.levelInterval)
			}
			this.level++
		}, LEVEL_INTERVAL);
	}
	
	handleLoss(player) {
		this.leaderboard.push(player.toObject())

		// Need a solution, this if statement runs 2 times, for the 2 last players.
		if (this.leaderboard.length >= this.players.length - 1) {
			this.players.forEach(player => {
				player.stopGame()
			})
		}

		if (this.leaderboard.length >= this.players.length) {
			clearInterval(this.levelInterval)
			this.room.endGame()
		}
	}

	removePlayer(toRemove) {
		toRemove.stopGame()
	}
}
