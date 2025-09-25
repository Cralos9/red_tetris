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
			log("Deleted Room", room.getCode())
			RoomsMap.delete(room.getCode())
		}
		log("%s, Disconnected:", socket.id, reason)
	}
	const leaveRoom = (payload) => {
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)

		log(socket.id, "Leaved room", roomCode)
		room.leavePlayer(room.getPlayer(socket.id))

		if (room.getNbrOfPlayers() === 0) {
			log("Deleted Room", room.getCode())
			RoomsMap.delete(room.getCode())
		}
	}
	socket.on('joinRoom', joinRoom)
	socket.on('leaveRoom', leaveRoom)
	socket.on('disconnect', disconnection)
}

export const gameHandlers = (io, socket, RoomsMap) => {
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
	const keyDown = (payload) => {
		const action = payload.action
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)

		if (room === undefined) {
			logError("Invalid Room code")
			return
		}
		const player = room.getPlayer(socket.id)
		if (player && player.getInGame() === true) { 
			player.getGameController().setAction(action, true)
		}
	}
	const keyUp = (payload) => {
		const action = payload.action
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)

		if (room === undefined) {
			logError("Invalid Room code")
			return
		}
		const player = room.getPlayer(socket.id)
		if (player && player.getInGame() === true) { 
			player.getGameController().setAction(action, false)
		}
	}
	socket.on("keyDown", keyDown)
	socket.on("keyUp", keyUp)
	socket.on('startGame', startGame)
}
