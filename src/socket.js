"use client"

import { io } from "socket.io-client"

export const SOCK_EVENTS = {
	CONNECT: "Connect",
	DISCONNECT: "Disconnect",
	SEND: "Send"
}

let socket

const createSocket = (options) => {
	socket = io(options)
	console.log("Created socket")
	return (socket)
}

export const socketMiddleWare = (action, store) => {
	if (action.type === SOCK_EVENTS.CONNECT) {
		if (!socket) {
			socket = createSocket({ autoConnect: false })
			socket.connect()

			socket.on("Test", (msg) => {
				store.dispatch({ type: "JOIN_ROOM", payload: msg})
			})

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
		socket.emit(action.payload.channel, action.payload.payload)
	}

	//if (action.type === "SOCK_DISCONNECT") {
	//	socket.disconnect()
	//}
}

