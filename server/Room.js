import { LEVEL_INTERVAL } from "./Game/gameParams.js";
import { roomDebug } from "./debug.js";
import { randomNbr } from "./Game/utils.js";

export class Room {
	constructor(roomCode, io) { 
		this.code = roomCode
		this.io = io
		this.plMap = new Map()
		this.owner = null;
		this.gameRunning = false
		roomDebug.roomlog(this, "Created")
	}

	setOwner(newOwner) { this.owner = newOwner }
	getOwner() { return (this.owner) }
	getNbrOfPlayers() { return (this.plMap.size) }
	getCode() { return (this.code) }
	getPlayer(playerId) { return (this.plMap.get(playerId)) }
	getPlMap() { return (this.plMap) }
	getGameManager() { return (this.gameManager) }

	addPlayer(newPlayer) {
		roomDebug.roomlog(this, "Player", newPlayer.name, "joined")
		this.plMap.set(newPlayer.id, newPlayer)
		roomDebug.printPlMap(this)
	}

	startGame() {
		if (this.gameRunning === true) { return }
		this.gameManager = new GameManager(this, Array.from(this.plMap.values()))
		this.gameRunning = true
		this.gameManager.startGame()
	}

	endGame() {
		this.io.to(this.code).emit('endGame', {
			leaderboard: this.gameManager.getLeaderboard()
		})
		this.gameRunning = false
		this.gameManager = null
	}

	leavePlayer(leaverPlayer) {
		roomDebug.roomlog(this, leaverPlayer.name, "left")
		if (leaverPlayer.getInGame() === true) {
			this.gameManager.removePlayer(leaverPlayer)
		}
		this.plMap.delete(leaverPlayer.id)
		this.io.to(this.code).emit("boardRemove", {id: leaverPlayer.id})
		if (leaverPlayer.getId() == this.owner) {
			this.owner = this.plMap.keys().next().value
		}
		roomDebug.printPlMap(this)
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
	}

	getPlayers() { return (this.players) }
	getSeed() { return (this.seed) }
	getLeaderboard() { return (this.leaderboard) }
	getOtherPlayers(filterPlayer) {
		return (this.players.filter(player => player !== filterPlayer))
	}

	startGame() {
		roomDebug.roomlog(this.room, "Starting Game, seed:", this.seed)
		this.players.forEach(player => {
			player.stopGame()
			player.startGame(this.seed, this, this.room.getCode())
		})

		this.levelInterval = setInterval(() => {
			const now = new Date().toLocaleTimeString();
			roomDebug.roomlog(this.room, `[${now}] Changing Level`)
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
			roomDebug.printLeaderboard(this.room)
			clearInterval(this.levelInterval)
			this.room.endGame()
		}
	}

	removePlayer(toRemove) {
		this.players.filter(player => player.id !== toRemove.id)
		toRemove.stopGame()
	}
}
