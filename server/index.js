import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"
import { gameHandlers } from "./gameHandlers.js"
import { playerHandlers } from "./playerHandlers.js"

const hostname = "localhost"
const port = 3000

const app = next({ dev: true, hostname, port })
const handler = app.getRequestHandler()

const RoomsMap = new Map()

app.prepare().then(() => {
	const server = createServer(handler)
	const io = new Server(server)
	
	io.on('connection', (socket) => {
		console.log("User Id:", socket.id)
		playerHandlers(socket, RoomsMap)
		gameHandlers(io, socket, RoomsMap)
	})

	server.listen(port, () => {
		console.log(`Server running on port: ${port}`)
	})
	
})
