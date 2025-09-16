import { createServer } from "node:http"
import express from "express"
import { Server } from "socket.io"
import { playerHandlers, gameHandlers } from "./handlers.js"

const hostname = process.env.HOST
const port = process.env.PORT
const dev = process.env.DEV === "DEV"

const RoomsMap = new Map()

const app = express()
app.use(express.static("dist"))

const server = createServer(app)
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
