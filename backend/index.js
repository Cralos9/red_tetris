import { createServer } from "node:http"
import path from "node:path"
import express from "express"
import { Server } from "socket.io"
import { playerHandlers, gameHandlers } from "./handlers.js"

const hostname = process.env.HOST
const port = process.env.PORT
const staticFilesDir = process.env.STATIC_FILES_DIR

const RoomsMap = new Map()

const app = express()
const server = createServer(app)
const io = new Server(server, { 'pingInterval': 7000, 'pingTimeout': 8000 })

app.use(express.static(staticFilesDir))

// Catches all get requests
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(import.meta.dirname, "../", staticFilesDir, "index.html"))
})

// Only for joining games via url
//app.get('/:room/:player_name', (req, res) => {
//	console.log(`Url request to ${req.params.room}/${req.params.player_name}`)
//	res.sendFile(path.join(import.meta.dirname, "../", staticFilesDir, "index.html"))
//})

io.on('connection', (socket) => {
	console.log("New Connection:", socket.id)
	playerHandlers(io, socket, RoomsMap)
	gameHandlers(io, socket, RoomsMap)
	socket.emit("Test", {msg:"LOL"})
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`)
})

const shutdownServer = () => {
	console.log("Closing the Server")
	io.disconnectSockets()
	server.closeAllConnections()
	process.exit()
}

process.on("SIGINT", shutdownServer)
process.on("SIGTERM", shutdownServer)
