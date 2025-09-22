"use client"

import { configureStore, createSlice } from "@reduxjs/toolkit"
import { socketMiddleware } from "./socket"

const playerSlice = createSlice({
	name: "Player",
	initialState: {
		name: null,
		room: null,
		isOwner: false
	},
	reducers: {
		setName: (state, action) => {
			state.name = action.payload
		},
		setRoom: (state, action) => {
			state.room = action.payload
		},
		setOwner: (state, action) => {
			state.isOwner = action.payload
		}
	}
})

const opponentGame = createSlice({
	name: "Opponents",
	initialState: {
		field: null,
		id: null,
	},
	reducers: {
		opponents: (state, action) => {
			state.field = action.payload.field
			state.id = action.payload.playerId
		}
	}
})

const gameSlice = createSlice({
	name: "Game",
	initialState: {
		field: null,
		nextPiece: null,
		heldPiece: null,
		score: null,
		combo: 0,
		linesCleared: 0,
		level: 0,
		id: null,
	},
	reducers: {
		tick: (state, action) => {
			state.field = action.payload.field
			state.nextPiece = action.payload.nextPiece
			state.heldPiece = action.payload.heldPiece
			state.score = action.payload.playerScore
			state.combo = action.payload.combo
			state.linesCleared = action.payload.linesCleared
			state.level = action.payload.level
			state.id = action.payload.id
		},
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

export const { opponents } = opponentGame.actions
export const { setName, setRoom, setOwner } = playerSlice.actions
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
		game: gameSlice.reducer,
		opponents: opponentGame.reducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().prepend(logger).concat(socketMiddleware)
})
