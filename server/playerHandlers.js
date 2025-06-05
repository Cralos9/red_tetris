import { Room } from "./Room.js"

export const playerHandlers = (socket, RoomsMap) => {
	const joinRoom = (payload) => {
		const playerName = payload.playerName
		const roomCode = payload.roomCode
		console.log("Player:", playerName)
		console.log("Joined Room:", roomCode)
		console.log("RoomMap:", RoomsMap)
		if (RoomsMap.has(roomCode) === false) {
			RoomsMap.set(roomCode, new Room(playerName))
		}
		socket.join(roomCode.toString())
	}
	socket.on('joinRoom', joinRoom)
}
