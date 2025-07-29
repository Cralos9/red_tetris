import { Room } from "./Room.js"
import { Player } from "./Player.js"
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
		var playerName = payload.playerName
		const roomCode = payload.roomCode
		const options = payload.options

		log("Player:", playerName)
		log("Joined Room:", roomCode)
		if (!RoomsMap.has(roomCode)) {
			RoomsMap.set(roomCode, new Room(roomCode, io))
		}
		const room = RoomsMap.get(roomCode)

		if (room.plMap.size == 0)
			room.owner = socket.id
		const player = new Player(playerName, options, io, socket.id, room)

		player.setRoom(room)
		room.addPlayer(socket.id, player)
		socket.join(roomCode.toString())
		io.to(roomCode).emit('join', room.toObject())
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
	}, 7000)

	socket.on('pong-check', () => {
		const room = findRoomBySocketId(socket.id)
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
	const keyDown = (payload) => {
		const key = payload.key
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.searchPlayer(socket.id)
		if (player && player.inGame === true) {
			console.log("Key:", key)
			if (key === "Escape") {
				player.stopGame()
			} else {
				player.keyboard.set(key, true)
			}
		}
	}
	const keyUp = (payload) => {
		const key = payload.key
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.searchPlayer(socket.id)
		if (player && player.inGame === true) {
			player.keyboard.set(key, false)
		}
	}
	const startGame = (payload) => {
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		if (room.owner != socket.id)
		{
			console.log("Not owner");
			return;
		}
		room.startGame(roomCode)
	}
	socket.on('startGame', startGame)
	socket.on('keyDown', keyDown)
	socket.on('keyUp', keyUp)
}
