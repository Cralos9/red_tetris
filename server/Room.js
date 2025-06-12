export class Room {
	constructor() { 
		this.plMap = new Map()
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, player) {
		this.plMap.set(socketId, player)
	}

	leavePlayer(socketId) {
		this.plMap.delete(socketId)
	}
}
