import Debug from "debug"
import GameManager from "./GameManager.js"

export default class Room {
	constructor(roomCode, io) { 
		this.code = roomCode
		this.io = io
		this.plMap = new Map()
		this.owner = null;
		this.gameRunning = false
		this.gameManager = null
		this.log = Debug(`Room:${this.code}`)
		this.startHeartbeat()
		this.log("Created")
	}

	
	setOwner(newOwner) { this.owner = newOwner }
	getOwner() { return (this.owner) }
	getNbrOfPlayers() { return (this.plMap.size) }
	getCode() { return (this.code) }
	getPlayer(playerId) { return (this.plMap.get(playerId)) }
	getPlMap() { return (this.plMap) }
	getGameManager() { return (this.gameManager) }
	getGameStatus() { return (this.gameRunning)}
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

	startHeartbeat() {
        const timeout = 7000;
		this.heartbeatInterval = setInterval(() => {
			const logger = Debug(`Heartbeat:${this.code}`)
			const now = Date.now();
			const toRemove = [];
		
			for (const [sockId, player] of this.plMap.entries()) {
				if (!player.lastPong) player.lastPong = now;
		
				if (now - player.lastPong > timeout) {
					logger("Player Remover", player.name);
					toRemove.push(sockId);
				} else {
					logger("heartBeat Sent")
					this.io.to(sockId).emit('ping-check');
				}
			}
		
			for (const sockId of toRemove) {
				this.leavePlayer(this.getPlayer(sockId));
			}
		
			if (this.getNbrOfPlayers() === 0) {
				clearInterval(this.heartbeatInterval);
			} else {
				const ownerId = this.getOwner();
				if (ownerId) this.io.to(ownerId).emit("Owner", { owner: ownerId });
			}
		}, timeout);
	}

	leavePlayer(leaverPlayer) {
		this.log("Player %s left", leaverPlayer.toString())
		if (leaverPlayer.getInGame() === true) {
			this.gameManager.removePlayer(leaverPlayer)
		}
		this.plMap.delete(leaverPlayer.id)
		this.io.to(this.code).emit("boardRemove", {id: leaverPlayer.id})
		if (leaverPlayer.getId() == this.owner) {
			this.owner = this.plMap.keys().next().value
			this.log("%s is the new Owner", this.owner)
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
