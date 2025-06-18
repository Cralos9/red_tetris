import { randomNbr } from "./utils.js"
import { Subject } from "./Subject.js"

export class Room extends Subject {
	constructor() { 
		super()
		this.plMap = new Map()
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, player) {
		this.addObserver(player)
		this.notify(Array.from(this.plMap.values()))
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
