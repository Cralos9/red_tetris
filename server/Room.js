export class Room {
	constructor(host) { 
		this.host = host
		this.playersArr = [host]
		console.log("Creating a Room")
	}
	
	addPlayer(player) {
		this.playersArr.push(player)
	}

	leavePlayer(player) {
		// Take out the player from players array
	}
}
