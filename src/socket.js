"use client"

import { io } from "socket.io-client"

export const SOCK_EVENTS = {
	CONNECT: "Socket/connect",
	SEND: "Socket/send"
}

let socket

const createSocket = () => {
	socket = io({ autoConnect: false })
	console.log("Created socket")
	return (socket)
}

export const socketMiddleware = (storeAPI) => (next) => (action) => {
	if (action.type === SOCK_EVENTS.CONNECT) {
		if (!socket) {
			socket = createSocket()
			socket.connect()

			socket.on("join", (msg) => {
				console.log("Received join", msg)
			})

			socket.on("Owner", (msg) => {
				console.log("Received Owner", msg)
			})

			socket.on("boardRemove", (msg) => {
				console.log("Received boardRemove", msg)
			})

			socket.on("endGame", (msg) => {
				console.log("Received endGame", msg)
			})

			socket.on("game", (msg) => {
				console.log("Received game", msg)
			})

			socket.on("Error", (msg) => {
				console.log("Received Error", msg)
			})

			socket.on("connection_error", (error) => {
				console.log("Error:", error.msg)
			})
		}
	}

	if (action.type === SOCK_EVENTS.SEND) {
		socket.emit(action.payload.event, action.payload.msg)
	}

	const result = next(action)

	return (result)
}

