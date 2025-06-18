export class Room {
	constructor() { 
		this.plMap = new Map()
		this.owner = null;
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, player) {
		this.plMap.set(socketId, player)
	}

	searchPlayer(playerId) {
		return (this.plMap.get(playerId))
	}

	leavePlayer(socketId) {
		this.plMap.delete(socketId)
	}
}
