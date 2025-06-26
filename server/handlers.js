import { Room } from "./Room.js"
import { Player } from "./Player.js"
import { keyBinds } from "./gameParams.js"
import { log } from "./debug.js"

// Map socket.id to Players
export const playerHandlers = (io, socket, RoomsMap) => {
	const findRoomBySocketId = (socketId) => {
		for (const room of RoomsMap.values()) {
			if (room.plMap.has(socketId)) return room
		}
		return null
	}

	const joinRoom = (payload) => {
		const playerName = payload.playerName
		const roomCode = payload.roomCode

		log("Player:", playerName)
		log("Joined Room:", roomCode)

		const player = new Player(playerName, io, socket.id)
		player.isAlive = true

		if (!RoomsMap.has(roomCode)) {
			RoomsMap.set(roomCode, new Room())
		}
		const room = RoomsMap.get(roomCode)

		if (room.plMap.size == 0)
			room.owner = socket.id

		room.addPlayer(socket.id, player)
		socket.join(roomCode.toString())

		const arr = []
		for (const socketId of room.plMap.keys()) {
			arr.push(socketId)
		}

		io.to(roomCode).emit('join', { playerIds: arr, roomOwner: room.owner , })
	}

	const disconnection = (reason) => {
		const room = findRoomBySocketId(socket.id)
		if (!room) return
		const player = room.plMap.get(socket.id)
		if (player) 
		{
			if(player.game)
				player.game.running = false
			room.leavePlayer(socket.id)
			socket.emit("Owner", {owner: room.owner})
			console.log("Disconnected:", reason)
		}
	}

	const heartbeatInterval = setInterval(() => {
		const room = findRoomBySocketId(socket.id)
		if (!room) return

		const toRemove = []
		for (const [sockId, player] of room.plMap.entries()) {
			if (!player.isAlive) {
				console.log("Player Remover")
				toRemove.push(sockId)
			} else {
				player.isAlive = false
				io.to(sockId).emit('ping-check')
			}
		}

		for (const sockId of toRemove) 
			room.leavePlayer(sockId)
		
		if (room.plMap.size === 0) {
			RoomsMap.delete(room.code)
		}
		socket.emit("Owner", {owner: room.owner})
	}, 10000)

	socket.on('pong-check', () => {
		const room = findRoomBySocketId(socket.id)
		console.log("answered ping")
		if (room) {
			const player = room.plMap.get(socket.id)
			if (player) player.isAlive = true
		}
	})

	socket.on('disconnection', disconnection)
	socket.on('joinRoom', joinRoom)

	socket.on('disconnect', () => {
		clearInterval(heartbeatInterval)
		disconnection("manual disconnect")
	})
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
				player.input.softDropPiece(1)
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
