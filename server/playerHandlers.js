import { Room } from "./Room.js"
import { Player } from "./Player.js"

export const playerHandlers = (socket, RoomsMap) => {
	const joinRoom = (payload) => {
		const playerName = payload.playerName
		const roomCode = payload.roomCode
		console.log("Player:", playerName)
		console.log("Joined Room:", roomCode)
		const player = new Player(playerName, socket)
		if (RoomsMap.has(roomCode) === false) {
			RoomsMap.set(roomCode, new Room(player))
		} else {
			RoomsMap.get(roomCode).addPlayer(player)
		}
		console.log("RoomMap:", RoomsMap)
		socket.join(roomCode.toString())
	}
	socket.on('joinRoom', joinRoom)
}
