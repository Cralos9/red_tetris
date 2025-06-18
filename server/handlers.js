import { Room } from "./Room.js"
import { Player } from "./Player.js"
import { keyBinds } from "./gameParams.js"
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
		if(room.plMap.size  == 0)
			room.owner = socket.id
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
		io.to(roomCode).emit('join', {playerIds: arr, roomOwner: room.owner})
	}
	const disconnection = (reason) => {
		const room = RoomsMap.get(reason.roomCode)
		// if (socket.id == room.owner)
		// 	room.owner = null;
		const player = room.plMap.get(socket.id)
		player.game.running = false;
		console.log("gameRunning: ", player.game.running)
		room.leavePlayer(socket.id)
		console.log("Disconnected:", reason)
	}
	socket.on('disconnection', disconnection)
	socket.on('joinRoom', joinRoom)
}

export const gameHandlers = (io, socket, RoomsMap) => {
	const gameInput = (payload) => {
		const key = payload.key
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.plMap.get(socket.id)
		log("KeyDown:", player.toString())
		switch (key) {
			case keyBinds.HARDDROP:
				player.input.hardDropPiece(true)
				break
			case keyBinds.MOVELEFT:
				player.input.movePiece(-1)
				break
			case keyBinds.MOVERIGHT:
				player.input.movePiece(1)
				break
			case keyBinds.ROTATERIGHT[0]:
			case keyBinds.ROTATERIGHT[1]:
				player.input.rotatePiece(1)
				break
			case keyBinds.ROTATELEFT:
				player.input.rotatePiece(-1)
				break
			case keyBinds.SOFTDROP:
				player.input.pushDownPiece(1)
				break
			case keyBinds.HOLD:
				player.input.holdPiece(true)
				break
			case "Escape":
				player.stopGame()
			default:
				console.log("Not Rec Key", key)
				break
		}
	}
	const startGame = (payload) => {
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.plMap.get(socket.id)
		if (room.owner != socket.id)
		{
			console.log("Not owner");
			return;
		}
		room.plMap.forEach(player => {
			log("Game Started,", player.toString())
			player.runGame(roomCode)
		})
	}
	socket.on('startGame', startGame)
	socket.on('keyDown', gameInput)
}
