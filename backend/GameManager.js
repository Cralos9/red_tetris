import { LEVEL_INTERVAL } from "./Game/gameParams.js";
import { randomNbr } from "./Game/utils.js";
import { printArr } from "./debug.js";

export default class GameManager {
	constructor(room, gamePlayers) {
		this.room = room
		this.players = gamePlayers
		this.leaderboard = []
		this.levelInterval = null
		this.seed = randomNbr(73458347)
		this.log = this.room.getLog().extend("GameManager")
	}

	getPlayers() { return (this.players) }
	getSeed() { return (this.seed) }
	getLeaderboard() { return (this.leaderboard) }
	getOtherPlayers(filterPlayer) {
		return (this.players.filter(player => player !== filterPlayer))
	}

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
				player.changeLevel()
			})
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
