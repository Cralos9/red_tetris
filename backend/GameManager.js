import { BEGIN_LEVEL, LEVEL_INTERVAL, MAX_LEVEL } from "./Game/gameParams.js";
import { printArr } from "./debug.js";
import { GAMEMODES } from "../common.js"
import { createGarbage42, createGarbageTetris } from "./Game/Strategy/CreateGarbage.js";
import { patternMatch42, patternMatchTetris } from "./Game/Strategy/PatternMatch.js";
import { garbageCalculation42, garbageCalculationTetris } from "./Game/Strategy/GarbageCalculation.js";

export default class GameManager {
	constructor(room, gamePlayers) {
		this.room = room
		this.players = gamePlayers
		this.leaderboard = []
		this.level = BEGIN_LEVEL
		this.levelInterval = null
		this.seed = Date.now()
		this.log = this.room.getLog().extend("GameManager")
		this.strats = {
			[GAMEMODES.Tetris]: {
				createGarbage: createGarbageTetris,
				patternMatch: patternMatchTetris,
				gbCalc: garbageCalculationTetris
			},
			[GAMEMODES.Base]: {
				createGarbage: createGarbage42,
				patternMatch: patternMatch42,
				gbCalc: garbageCalculation42
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
			if (this.level === MAX_LEVEL) {
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
