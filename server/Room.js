export class Room {
	constructor() { 
		this.plMap = new Map()
		this.owner = null;
		this.placements = []
		this.levelInterval = null
		console.log("Creating a Room")
	}
	
	addPlayer(socketId, newPlayer) {
		console.log("This Player joined the Room")
		this.plMap.forEach(player => {
			player.targets.push(newPlayer)
			newPlayer.targets.push(player)
		})
		this.plMap.set(socketId, newPlayer)
		Array.from(this.plMap.values()).forEach(player => {
			console.log("playerName: ", player.name)
		})
	}

	startGame(roomCode) {
		this.plMap.forEach(player => {
			player.runGame(roomCode)
		})

		this.levelInterval = setInterval(() => {
			const now = new Date().toLocaleTimeString();
			console.log(`[${now}] Changing Level`);
			this.plMap.forEach(player => {
				player.changeLevel()
			})
		}, 30000);
	}

	// Need a better function name
	handleGame(player) {
		this.placements.push(player)
		
		if (this.placements.length >= this.plMap.size - 1) {
			// Socket msg everyone in room
			clearInterval(this.levelInterval)
			console.log("Game Finished")
		}
	}

	searchPlayer(playerId) {
		return (this.plMap.get(playerId))
	}

	leavePlayer(socketId) {
		console.log("This Player left the Room")
		this.plMap.forEach(player => {
			player.targets.filter(player => player.id !== socketId)
		})
		this.plMap.delete(socketId)
		if (socketId == this.owner)
		{
			this.owner = this.plMap.keys().next().value
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
