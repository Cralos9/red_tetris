import Room from "./Room.js"
import Player from "./Player.js"
import Debug from "debug"

const log = Debug("Handlers:Log")
const logError = Debug("Handlers:Error")

// Map socket.id to Players
export const playerHandlers = (io, socket, RoomsMap) => {
	const findRoomBySocketId = (socketId) => {
		for (const room of RoomsMap.values()) {
			if (room.getPlMap().has(socketId)) return room
		}
		return null
	}
	const joinRoom = (payload) => {
		var playerName = payload.playerName
		const roomCode = payload.roomCode
		const options = payload.options
		const gamemode = payload.gameMode

		if (!RoomsMap.has(roomCode)) {
			RoomsMap.set(roomCode, new Room(roomCode, gamemode, io))
		}

		const room = RoomsMap.get(roomCode)

		if (room.getGamemode() !== gamemode) {
			socket.emit('Error', {reason: "Wrong Gamemode"})
			log("Player", playerName, "has the wrong gamemode")
			return
		}

		const player = new Player(playerName, options, io, socket.id)

		room.addPlayer(player)
		socket.join(roomCode.toString())
		io.to(roomCode).emit('join', room.toObject())
	}
	const disconnection = (reason) => {
		const room = findRoomBySocketId(socket.id)
		if (!room) {
			return
		}
		const player = room.getPlayer(socket.id)
		if (!player) {
			return
		}
		room.leavePlayer(player)

		if (room.getNbrOfPlayers() === 0) {
			RoomsMap.delete(room.getCode())
		}
		log("%s, Disconnected:", socket.id, reason)
		// Close the player socket here
	}
	socket.on('joinRoom', joinRoom)
	socket.on('disconnect', disconnection)
}

export const gameHandlers = (io, socket, RoomsMap) => {
	const keyDown = (payload) => {
		const key = payload.key
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.getPlayer(socket.id)

		if (room === undefined) {
			logError("Invalid Room code", payload)
			return
		}

		if (player && player.getInGame() === true) {
			if (key === "Escape") {
				player.stopGame()
			} else {
				player.getGameController().setPress(key, player.game.getFrames(), true)
			}
		}
	}
	const keyUp = (payload) => {
		const key = payload.key
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.getPlayer(socket.id)

		if (room === undefined) {
			logError("Invalid Room code", payload)
			return
		}

		if (player && player.getInGame() === true) {
			player.getGameController().setRelease(key, 0, false)
		}
	}
	const startGame = (payload) => {
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)

		if (room === undefined) {
			logError("Invalid Room code", payload)
			return
		}

		try {
			room.startGame(socket.id)
		} catch (errorMsg) {
			logError(errorMsg)
		}
	}
	socket.on('startGame', startGame)
	socket.on('keyDown', keyDown)
	socket.on('keyUp', keyUp)
}
