import { keyBinds } from "./gameParams.js"
import { log } from "./debug.js"

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
		console.log("Code", roomCode)
		const room = RoomsMap.get(roomCode)
		room.plMap.forEach(player => {
			log("Game Started,", player.toString())
			player.runGame(roomCode)
		})
	}
	socket.on('startGame', startGame)
	socket.on('keyDown', gameInput)
}
