import { Server } from "socket.io"
import { Game } from "./game.js"

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
					game.Piece.moveLeft()	
					break
				case "ArrowRight":
					game.Piece.moveRight()
					break
				case "ArrowUp":
					game.Piece.rotateRight()	
					break
			}
		})
	})
}

async function startGame(game) {
	while (1) {
		await new Promise(r => setTimeout(r, 1000))
		game.update()
		//console.table(game.field)
	}
}
