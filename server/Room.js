import { Subject } from "./Subject.js"
import { Events } from "./globalEvents.js"

export class Room extends Subject {
	constructor() { 
		super()
		this.plMap = new Map()
		this.owner = null;
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, player) {
		console.log("This Player joined the Room")
		this.notify(player, Events.JOIN_PLAYER)
		player.targets = Array.from(this.plMap.values())
		this.plMap.set(socketId, player)
		this.addObserver(player)
	}

	searchPlayer(playerId) {
		return (this.plMap.get(playerId))
	}

	leavePlayer(socketId) {
		console.log("This Player left the Room")
		const player = this.plMap.get(socketId)
		this.plMap.delete(socketId)
		this.removeObserver(player)
		this.notify(player, Events.LEAVE_PLAYER)
		if (socketId == this.owner)
			this.owner = this.plMap.keys().next().value
		console.log("new owner:", this.owner)
	}
}
