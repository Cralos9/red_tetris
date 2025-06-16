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

export const gameHandlers = (io, socket, RoomsMap) => {
	const gameInput = (payload) => {
		const parsed = JSON.parse(payload)
		const keys = parsed.keys
		const roomCode = parsed.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.plMap.get(socket.id)
		log("KeyDown:", player.toString())
		if (keys[keyBinds.MOVELEFT]) { player.input.movePiece(-1) }
		if (keys[keyBinds.MOVERIGHT]) { player.input.movePiece(1) }
		if (keys[keyBinds.HARDDROP]) { player.input.hardDropPiece(true) }
		if (keys[keyBinds.HOLD]) { player.input.holdPiece(true) }
		if (keys[keyBinds.ROTATELEFT]) { player.input.rotatePiece(-1) }
		if (keys[keyBinds.ROTATERIGHT]) { player.input.rotatePiece(1) }
		if (keys[keyBinds.SOFTDROP]) { player.input.pushDownPiece(true) }
		if (keys["Escape"]) { player.stopGame() }
	}
	const keyUp = (payload) => {
		const parsed = JSON.parse(payload)
		const keys = parsed.keys
		const roomCode = parsed.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.plMap.get(socket.id)
		log("KeyDown:", player.toString())
		if (!keys[keyBinds.MOVELEFT]) { player.input.movePiece(0) }
		if (!keys[keyBinds.MOVERIGHT]) { player.input.movePiece(0) }
		if (!keys[keyBinds.HARDDROP]) { player.input.hardDropPiece(false) }
		if (!keys[keyBinds.HOLD]) { player.input.holdPiece(false) }
		if (!keys[keyBinds.ROTATELEFT]) { player.input.rotatePiece(0) }
		if (!keys[keyBinds.ROTATERIGHT]) { player.input.rotatePiece(0) }
		if (!keys[keyBinds.SOFTDROP]) { player.input.pushDownPiece(false) }
	}
	const startGame = (payload) => {
		const roomCode = payload.roomCode
		console.log("Code", roomCode)
		const room = RoomsMap.get(roomCode)
		room.plMap.forEach(player => {
			log("Game Started,", player.toString())
			player.runGame(roomCode)
		})
	}
	socket.on('startGame', startGame)
	socket.on('keyDown', gameInput)
	socket.on('keyUp', keyUp)
}
