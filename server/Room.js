import { randomNbr } from "./utils.js"

export class Room {
	constructor() { 
		this.plMap = new Map()
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, player) {
		this.plMap.set(socketId, player)
	}

	getTarget() {
		const keys = Array.from(this.plMap.values())
		return (keys[randomNbr(this.plMap.size)])
	}

	searchPlayer(playerId) {
		return (this.plMap.get(playerId))
	}

	leavePlayer(socketId) {
		this.plMap.delete(socketId)
	}
}
