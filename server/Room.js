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

	leavePlayer(socketId, room) {
		console.log("Player Removed: ", socketId)
		console.log("old owner:", room.owner)
		this.plMap.delete(socketId)
		if (socketId == room.owner)
			room.owner = room.plMap.keys().next().value
		console.log("new owner:", room.owner)
	}
}
