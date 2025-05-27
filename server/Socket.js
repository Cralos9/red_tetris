import { Server } from "socket.io"
import { Game } from "./game.js"
import { moveHorizontal, rotation } from "./movement.js"

var game;
var io;

export function connectSocket(server) {
	io = new Server(server)

	io.on("connection", (socket) => {
		console.log("User connected:", socket.id)
		socket.on('action', (msg) => {
			console.log("Event:", msg.key)
			switch (msg.key) {
				case "Enter":
					game = new Game(10, 20, socket)
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
			}
		})
	})
}

async function startGame(game) {
	while (1) {
		await new Promise(r => setTimeout(r, 500))
		game.update()
		//console.table(game.field)
	}
}
