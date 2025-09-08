import Debug from "debug"
import GameManager from "./GameManager.js"

export default class Room {
	constructor(roomCode, gamemode, io) { 
		this.code = roomCode
		this.io = io
		this.plMap = new Map()
		this.owner = null;
		this.gamemode = gamemode
		this.gameRunning = false
		this.gameManager = null
		this.log = Debug(`Room:${this.code}`)
		this.log("Created", this.gamemode, "Room")
	}
	
	setOwner(newOwner) {
		this.owner = newOwner
		this.log("New Owner", newOwner ? newOwner.getId() : undefined)
	}
	getOwner() { return (this.owner) }
	getNbrOfPlayers() { return (this.plMap.size) }
	getCode() { return (this.code) }
	getPlayer(playerId) { return (this.plMap.get(playerId)) }
	getPlMap() { return (this.plMap) }
	getGameManager() { return (this.gameManager) }
	getGameStatus() { return (this.gameRunning)}
	getGamemode() { return (this.gamemode) }
	getLog() { return (this.log) }

	addPlayer(newPlayer) {
		this.log("Player %s joined", newPlayer.toString())
		if (this.getNbrOfPlayers() == 0) {
			this.setOwner(newPlayer)
		}
		this.plMap.set(newPlayer.getId(), newPlayer)
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
		this.log("Player %s left", leaverPlayer.toString())
		if (leaverPlayer.getInGame() === true) {
			this.gameManager.removePlayer(leaverPlayer)
		}
		this.plMap.delete(leaverPlayer.getId())
		if (leaverPlayer === this.owner) {
			this.setOwner(this.plMap.values().next().value)
			if (this.owner !== undefined) {
				this.owner.io.emit("Owner", {owner: this.owner.getId()})
			}
		}
		this.io.to(this.code).emit("boardRemove", {id: leaverPlayer.getId()})
	}

	toObject() {
		return {
			playerIds: Array.from(this.plMap.keys()),
			roomOwner: this.owner.getId(),
			playerNames: Array.from(this.plMap.values()).map(player => player.name)
		}
	}
}
