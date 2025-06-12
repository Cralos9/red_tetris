import { Room } from "./Room.js"
import { Player } from "./Player.js"
import { log } from "./debug.js"

// Map socket.id to Players
export const playerHandlers = (socket, RoomsMap) => {
	const joinRoom = (payload) => {
		const playerName = payload.playerName
		const roomCode = payload.roomCode
		log("Player:", playerName)
		log("Joined Room:", roomCode)
		const player = new Player(playerName, socket)
		if (RoomsMap.has(roomCode) === false) {
			RoomsMap.set(roomCode, new Room())
		}
		RoomsMap.get(roomCode).addPlayer(socket.id, player)
		console.log("RoomMap:", RoomsMap)
		socket.join(roomCode.toString())
	}
	const disconnection = (reason) => {
		console.log("Disconnected:", reason)
	}
	socket.on('disconnect', disconnection)
	socket.on('joinRoom', joinRoom)
}
