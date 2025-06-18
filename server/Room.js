import { Subject } from "./Subject.js"

export class Room extends Subject {
	constructor() { 
		super()
		this.plMap = new Map()
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, player) {
		this.notify(player)
		player.targets = Array.from(this.plMap.values())
		this.plMap.set(socketId, player)
		this.addObserver(player)
	}

	searchPlayer(playerId) {
		return (this.plMap.get(playerId))
	}

	leavePlayer(socketId) {
		//const player = this.plMap.get(socketId)
		//this.removeObserver(player)
		//this.notify(player)
		this.plMap.delete(socketId)
	}
}
