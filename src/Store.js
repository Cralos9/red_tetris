"use client"

import { configureStore, createSlice } from "@reduxjs/toolkit"
import { socketMiddleware } from "./socket"

const playerSlice = createSlice({
	name: "Player",
	initialState: {
		name: undefined,
		room: undefined
	},
	reducers: {
		setName: (state, action) => {
			state.name = action.payload
		},
		setRoom: (state, action) => {
			state.room = action.payload
		}
	}
})

const gameSlice = createSlice({
	name: "Game",
	initialState: {
		field: null,
		nextPiece: null,
		heldPiece: null,
		combo: null,
		linesCleared: null,
		level: null,
		playerId: null,
	},
	reducers: {
		tick: (state, action) => {
			state.field = action.payload.field
			state.nextPiece = action.payload.nextPiece
			state.heldPiece = action.payload.heldPiece
			state.combo = action.payload.combo
			state.linesCleared = action.payload.linesCleared
			state.level = action.payload.level
			state.playerId = action.payload.playerId
		}
	}
})

const socketSlice = createSlice({
	name: "Socket",
	initialState: {},
	reducers:
	{
		send: (state, action) => 
		{
			return;
		},
		disconnect: (state, action) =>
		{
			return;
		},
 	}
})

export const { setName, setRoom } = playerSlice.actions
export const { send, disconnect, owner } = socketSlice.actions
export const { tick } = gameSlice.actions

const logger = (storeAPI) => (next) => (action) => {
	console.log("Dispatch called with action", action)
	const result = next(action)
	return (result)
}

export const store = configureStore({
	reducer: {
		player: playerSlice.reducer,
		socket: socketSlice.reducer,
		game: gameSlice.reducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().prepend(logger).concat(socketMiddleware)
})
