import { Subject } from "./Observer/Subject.js"
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
		Array.from(this.plMap.values()).forEach(player => {
			console.log("playerName: ", player.name)
		})
	}

	startGame(roomCode) {
		this.plMap.forEach(player => {
			player.runGame(roomCode)
		})

		setInterval(() => {
			console.log("Changing Level")
			this.notify(null, Events.UPDATE_LEVEL)
		}, 30000)
	}

	searchPlayer(playerId) {
		return (this.plMap.get(playerId))
	}

	leavePlayer(socketId, socket) {
		console.log("This Player left the Room")
		const player = this.plMap.get(socketId)
		this.plMap.delete(socketId)
		this.removeObserver(player)
		this.notify(player, Events.LEAVE_PLAYER)
		if (socketId == this.owner)
		{
			this.owner = this.plMap.keys().next().value
		}
		console.log("new owner:", this.owner)
	}

	toObject() {
		return {
			playerIds: Array.from(this.plMap.keys()),
			roomOwner: this.owner,
			playerNames: Array.from(this.plMap.values()).map(player => player.name)
		}
	}
}
