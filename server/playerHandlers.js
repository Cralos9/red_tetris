import { Room } from "./Room.js"
import { Player } from "./Player.js"
import { log } from "./debug.js"

// Map socket.id to Players
export const playerHandlers = (io, socket, RoomsMap) => {
	const joinRoom = (payload) => {
		const playerName = payload.playerName
		const roomCode = payload.roomCode
		log("Player:", playerName)
		log("Joined Room:", roomCode)
		const player = new Player(playerName, io, socket.id)
		if (RoomsMap.has(roomCode) === false) {
			RoomsMap.set(roomCode, new Room())
		}
		const room = RoomsMap.get(roomCode)
		room.addPlayer(socket.id, player)
		console.log("RoomMap:", RoomsMap)
		socket.join(roomCode.toString())
		const arr = []
		const iter = room.plMap.keys()
		let value = iter.next().value
		while (value !== undefined) {
			arr.push(value)
			console.log(value)
			value = iter.next().value
		}
		io.to(roomCode).emit('join', {playerIds: arr})
	}
	const disconnection = (reason) => {
		console.log("Disconnected:", reason)
	}
	socket.on('disconnect', disconnection)
	socket.on('joinRoom', joinRoom)
}
