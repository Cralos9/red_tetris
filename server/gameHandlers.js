import { log } from "./debug.js"

export const gameHandlers = (io, socket, RoomsMap) => {
	const gameInput = (payload) => {
		const key = payload.key
		const roomCode = payload.roomCode
		const room = RoomsMap.get(roomCode)
		const player = room.plMap.get(socket.id)
		log("KeyDown:", player.toString())
		switch (key) {
			case " ":
				player.input.hardDropPiece(true)
				break
			case "ArrowLeft":
				player.input.movePiece(-1)
				break
			case "ArrowRight":
				player.input.movePiece(1)
				break
			case "x":
			case "ArrowUp":
				player.input.rotatePiece(1)
				break
			case "z":
				player.input.rotatePiece(-1)
				break
			case "ArrowDown":
				player.input.pushDownPiece(1)
				break
			case "c":
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
