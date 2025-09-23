"use client"

import { io } from "socket.io-client"
import { send, tick, setOwner, opponents, endGame, setId, joiners, boardRem } from "./Store"

let socket

const createSocket = () => {
	socket = io({ autoConnect: false })
	console.log("Created socket")
	return (socket)
}

export function sendSocketMsg(event, payload) {
	return {
		event: event,
		payload: payload
	}
}

export const socketMiddleware = (storeAPI) => (next) => (action) => {
	if (!socket) {
		socket = createSocket()
		socket.connect()

		socket.on("connect", () => {
			console.log("Connected Socket")
			storeAPI.dispatch(setId(socket.id))
		})

		socket.on("join", (msg) => {
			// console.log("Received join", msg)
			storeAPI.dispatch(joiners(msg));
		})

		socket.on("Owner", (msg) => {
			// console.log("Received Owner", msg)
			storeAPI.dispatch(setOwner(true))
		})

		socket.on("boardRemove", (msg) => {
			console.log("Received boardRemove", msg)
			storeAPI.dispatch(boardRem(msg));
		})

		socket.on("endGame", (msg) => {
			console.log("Received endGame", msg)
			storeAPI.dispatch(endGame(msg))
		})

		socket.on("game", (msg) => {
			// console.log("Received game", msg)
			if (socket.id === msg.playerId) {
				storeAPI.dispatch(tick(msg))
			} else {
				storeAPI.dispatch(opponents(msg))
			}
		})

		socket.on("Error", (msg) => {
			console.log("Received Error", msg)
		})

		socket.on("connection_error", (error) => {
			console.log("Error:", error.msg)
		})
	}

	if (send.match(action)) {
		socket.emit(action.payload.event, action.payload.payload)
	}

	const result = next(action)

	return (result)
}

