import { Server } from "socket.io"
import { Game } from "./game.js"
import { moveHorizontal, moveVertical, rotation, holdPiece } from "./movement.js"

var game
var io

export function connectSocket(server) {
	io = new Server(server)

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id)
		socket.on('action', (msg) => {
			//console.log("Event:", msg.key)
			switch (msg.key) {
				case "start":
					game = new Game()
					console.log("Game CREATED")
					startGame(game, socket)
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
			}
		})
	})
}

async function startGame(game, socket) {
	const FPS = 60
	const timeDelay = 1000 / FPS
	let currTime
	let frameTime

	while (game.running) {
		currTime = Date.now()

		game.update()
		socket.emit('action', {field: game.field})
		console.table(game.field)

		frameTime = Date.now() - currTime
		if (frameTime > -1 && frameTime < timeDelay) {
			await new Promise(r => setTimeout(r, timeDelay - frameTime))
		}
	}
}
