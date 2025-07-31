import { LEVEL_INTERVAL } from "./Game/gameParams.js";

export class Room {
	constructor(roomCode, io) { 
		this.code = roomCode
		this.io = io
		this.plMap = new Map()
		this.owner = null;
		this.leaderboard = []
		this.levelInterval = null
		this.gameRunning = false
		console.log("Creating a Room")
	}

	setOwner(newOwner) { this.owner = newOwner }

	getOwner() { return (this.owner) }

	getNbrOfPlayers() { return (this.plMap.size) }

	getCode() { return (this.code) }
	
	addPlayer(socketId, newPlayer) {
		console.log("This Player joined the Room")
		this.plMap.forEach(player => {
			player.targets.push(newPlayer)
			newPlayer.targets.push(player)
		})
		this.plMap.set(socketId, newPlayer)
		console.log("Room Array")
		Array.from(this.plMap.values()).forEach(player => {
			console.log("- PlayerName:", player.name)
		})
	}

	startGame() {
		this.leaderboard = []
		this.plMap.forEach(player => {
			player.stopGame()
		})
		this.gameRunning = true
		this.plMap.forEach(player => {
			player.runGame()
		})

		this.levelInterval = setInterval(() => {
			const now = new Date().toLocaleTimeString();
			console.log(`[${now}] Changing Level`);
			this.plMap.forEach(player => {
				player.changeLevel()
			})
		}, LEVEL_INTERVAL);
	}

	// Need a better function name
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
			this.io.to(this.code).emit('endGame', {
				leaderboard: this.leaderboard
			})
			clearInterval(this.levelInterval)
			console.log("Game Finished")
		}
	}

	searchPlayer(playerId) { return (this.plMap.get(playerId)) }

	leavePlayer(leaverPlayer) {
		console.log("This Player left the Room")
		this.plMap.forEach(player => {
			player.targets.filter(player => player.id !== leaverPlayer.id)
		})
		leaverPlayer.stopGame()
		this.plMap.delete(leaverPlayer.id)
		this.io.to(this.code).emit("boardRemove", {id: leaverPlayer.id})
		if (leaverPlayer.id == this.owner) {
			this.owner = this.plMap.keys().next().value
		}
		Array.from(this.plMap.values()).forEach(player => {
			console.log("- PlayerName:", player.name)
		})
	}

	toObject() {
		return {
			playerIds: Array.from(this.plMap.keys()),
			roomOwner: this.owner,
			playerNames: Array.from(this.plMap.values()).map(player => player.name)
		}
	}
}
