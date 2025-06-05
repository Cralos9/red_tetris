import { Game } from "./game.js"
import { moveHorizontal, moveVertical, rotation, holdPiece, hardDrop } from "./movement.js"

var game

export const gameHandlers = (io, socket) => {
	const gameInput = (payload) => {
		const key = payload.key
		switch (key) {
			case " ":
				hardDrop(true)
				break
			case "ArrowLeft":
				moveHorizontal(-1)
				break
			case "ArrowRight":
				moveHorizontal(1)
				break
			case "x":
			case "ArrowUp":
				rotation(1)
				break
			case "z":
				rotation(-1)
				break
			case "ArrowDown":
				moveVertical(1)
				break
			case "Escape":
				game.running = false
				break
			case "c":
				holdPiece(true)
				break

			default:
				console.log("Not Rec Key")
				break
		}
	}
	const startGame = (payload) => {
		const roomCode = payload.roomCode
		console.log("Starting Game")
		game = new Game()
		Tetris(io, game, roomCode)
	}
	socket.on('startGame', startGame)
	socket.on('action', gameInput)
}

async function Tetris(io, game, roomCode) {
	const FPS = 60
	const timeDelay = 1000 / FPS
	let currTime
	let frameTime


	while (game.running) {
		currTime = Date.now()
		game.update()
		io.to(roomCode.toString()).emit('action', {field: game.field})
		console.table(game.field)
		frameTime = Date.now() - currTime
		if (frameTime > -1 && frameTime < timeDelay) {
			await new Promise(r => setTimeout(r, timeDelay - frameTime))
		}
	}

}
