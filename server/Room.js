import { LEVEL_INTERVAL } from "./Game/gameParams.js";
import { roomDebug } from "./debug.js";

export class Room {
	constructor(roomCode, io) { 
		this.code = roomCode
		this.io = io
		this.plMap = new Map()
		this.owner = null;
		this.leaderboard = []
		this.levelInterval = null
		this.gameRunning = false
		roomDebug.roomlog(this, "Created")
	}

	setOwner(newOwner) { this.owner = newOwner }

	getOwner() { return (this.owner) }

	getNbrOfPlayers() { return (this.plMap.size) }

	getCode() { return (this.code) }

	getPlayer(playerId) { return (this.plMap.get(playerId)) }

	getPlMap() { return (this.plMap) }

	getLeaderboard() { return (this.leaderboard) }

	addPlayer(newPlayer) {
		roomDebug.roomlog(this, newPlayer.name, "joined")
		this.plMap.forEach(player => {
			player.targets.push(newPlayer)
			newPlayer.targets.push(player)
		})
		this.plMap.set(newPlayer.id, newPlayer)
		roomDebug.printPlMap(this)
	}

	startGame() {
		roomDebug.roomlog(this, "Starting Game")
		this.leaderboard = []
		this.plMap.forEach(player => {
			player.stopGame()
		})

		this.gameRunning = true
		this.plMap.forEach(player => {
			player.runGame()
		})

		roomDebug.roomlog(this, "Starting Level Interval")
		this.levelInterval = setInterval(() => {
			const now = new Date().toLocaleTimeString();
			roomDebug.roomlog(this, `[${now}] Changing Level`)
			this.plMap.forEach(player => {
				player.changeLevel()
			})
		}, LEVEL_INTERVAL);
	}

	handleLoss(player) {
		this.leaderboard.push(player.toObject())

		// Need a solution, this if statement runs 2 times, for the 2 last players.
		if (this.leaderboard.length >= this.plMap.size - 1) {
			this.plMap.forEach(player => {
				player.stopGame()
			})
		}
		if (this.leaderboard.length >= this.plMap.size) {
			// Need to think if this flag makes sense when you are watching other people games
			//this.plMap.forEach(player => {
			//	player.setIngame(false)
			//})
			this.gameRunning = false
			roomDebug.printLeaderboard(this)
			this.io.to(this.code).emit('endGame', {
				leaderboard: this.leaderboard
			})
			clearInterval(this.levelInterval)
		}
	}

	leavePlayer(leaverPlayer) {
		roomDebug.roomlog(this, leaverPlayer.name, "left")
		this.plMap.forEach(player => {
			player.targets = player.targets.filter(player => player.id !== leaverPlayer.id)
		})
		leaverPlayer.stopGame()
		this.plMap.delete(leaverPlayer.id)
		this.io.to(this.code).emit("boardRemove", {id: leaverPlayer.id})
		if (leaverPlayer.id == this.owner) {
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
