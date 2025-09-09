import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"
import { playerHandlers, gameHandlers } from "./handlers.js"

const hostname = "localhost"
const port = 3000

const app = next({ dev: true, hostname, port })
const handler = app.getRequestHandler()

const RoomsMap = new Map()


app.prepare().then(() => {
	const server = createServer(handler)
	const io = new Server(server, { 'pingInterval': 7000, 'pingTimeout': 8000 })
	
	io.on('connection', (socket) => {
		playerHandlers(io, socket, RoomsMap)
		gameHandlers(io, socket, RoomsMap)
	})

	server.listen(port, () => {
		console.log(`Server running on port: ${port}`)
	})

	const shutdownServer = () => {
		console.log("Closing the Server")
		io.disconnectSockets()
		server.closeAllConnections()
		process.exit()
	}

	process.on("SIGINT", shutdownServer)
	process.on("SIGTERM", shutdownServer)
})
