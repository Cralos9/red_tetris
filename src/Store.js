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
export const { send, disconnect } = socketSlice.actions

const logger = (storeAPI) => (next) => (action) => {
	console.log("Dispatch called with action", action)
	const result = next(action)
	return (result)
}

export const store = configureStore({
	reducer: {
		player: playerSlice.reducer,
		socket: socketSlice.reducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().prepend(logger).concat(socketMiddleware)
})
