import { createServer } from "node:http"
import next from "next"
import { connectSocket } from "./Socket.js"

const hostname = "localhost"
const port = 3000

const app = next({ dev: true, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
	const server = createServer(handler)
	
	connectSocket(server)

	server.listen(port, () => {
		console.log(`Server running on port: ${port}`)
	})
	
})
