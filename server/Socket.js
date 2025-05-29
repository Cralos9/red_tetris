import { Server } from "socket.io"
import { Game } from "./game.js"
import { moveHorizontal, moveVertical, rotation, setTime } from "./movement.js"

var game
var running
var io

export function connectSocket(server) {
	io = new Server(server)

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id)
		socket.on('action', (msg) => {
			console.log("Event:", msg.key)
			switch (msg.key) {
				case "Enter":
					game = new Game(socket)
					running = true
					startGame(game)
					break
				case "ArrowLeft":
					moveHorizontal(-1)
					break
				case "ArrowRight":
					moveHorizontal(1)
					break
				case "ArrowUp":
					rotation(1)
					break
				case "ArrowDown":
					moveVertical(1)
					break
				case "Escape":
					running = false
					break
			}
		})
	})
}

async function startGame(game) {
	const FPS = 60
	const timeDelay = 1000 / FPS
	let currTime
	let frameTime

	while (running) {
		currTime = Date.now()
		game.update()
		console.table(game.field)
		frameTime = Date.now() - currTime
		if (frameTime > -1 && frameTime < timeDelay) {
			await new Promise(r => setTimeout(r, timeDelay - frameTime))
		}
	}
}
