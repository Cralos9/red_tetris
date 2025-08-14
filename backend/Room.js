import { LEVEL_INTERVAL } from "./Game/gameParams.js";
import { randomNbr } from "./Game/utils.js";
import Debug from "debug"
import Colors from "colors"
import { printArr } from "./debug.js";

export class Room {
	constructor(roomCode, io) { 
		this.code = roomCode
		this.io = io
		this.plMap = new Map()
		this.owner = null;
		this.gameRunning = false
		this.log = Debug(`Room:${this.code}`)
		this.log("Created")
	}

	setOwner(newOwner) { this.owner = newOwner }
	getOwner() { return (this.owner) }
	getNbrOfPlayers() { return (this.plMap.size) }
	getCode() { return (this.code) }
	getPlayer(playerId) { return (this.plMap.get(playerId)) }
	getPlMap() { return (this.plMap) }
	getGameManager() { return (this.gameManager) }
	getLog() { return (this.log) }

	addPlayer(newPlayer) {
		this.log("Player %s joined", newPlayer.toString())
		this.plMap.set(newPlayer.id, newPlayer)
	}

	startGame() {
		if (this.gameRunning === true) { return }
		this.gameManager = new GameManager(this, Array.from(this.plMap.values()))
		this.gameRunning = true
		this.gameManager.startGame()
		this.log("Started Game")
	}

	endGame() {
		this.io.to(this.code).emit('endGame', {
			leaderboard: this.gameManager.getLeaderboard()
		})
		this.gameRunning = false
		this.gameManager = null
		this.log("Game End")
	}

	leavePlayer(leaverPlayer) {
		this.log("Player %s leaved", leaverPlayer.toString())
		if (leaverPlayer.getInGame() === true) {
			this.gameManager.removePlayer(leaverPlayer)
		}
		this.plMap.delete(leaverPlayer.id)
		this.io.to(this.code).emit("boardRemove", {id: leaverPlayer.id})
		if (leaverPlayer.getId() == this.owner) {
			this.owner = this.plMap.keys().next().value
			this.log("%s is the new Owner", this.owner.green)
		}
	}

	toObject() {
		return {
			playerIds: Array.from(this.plMap.keys()),
			roomOwner: this.owner,
			playerNames: Array.from(this.plMap.values()).map(player => player.name)
		}
	}
}

class GameManager {
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
			// Need to think if this flag makes sense when you are watching other people games
			//this.plMap.forEach(player => {
			//	player.setIngame(false)
			//})
			clearInterval(this.levelInterval)
			this.room.endGame()
		}
	}

	removePlayer(toRemove) {
		toRemove.stopGame()
		// Is it worth to remove the player from the array of players
	}
}
