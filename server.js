import { createServer } from "node:http"
import next from "next"
import { Server } from "socket.io"

const hostname = "localhost"
const port = 3000

const app = next({ dev: true, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
	const server = createServer(handler)
	const io = new Server(server)

	io.on("connection", (socket) => {
		console.log("User connected: ", socket.id)
		socket.on('action', (msg) => {
			console.log("Msg: ", msg)
		})
	})

	server.listen(port, () => {
		console.log(`Server running on port: ${port}`)
	})
})
