"use client"

import { configureStore, createSlice } from "@reduxjs/toolkit"
import { socketMiddleware } from "./socket"

const slice = createSlice({
	name: "ChangeName",
	initialState: { msg: "POL" },
	reducers: {
		change: (state, action) => {
			state.msg = action.payload
		}
	}
})

const roomSlice = createSlice({
	name: "RoomCode",
	initialState: {room: "void", gameMode:"void"},
	reducers:
	{
		changeRoom:(state, action) =>
		{
			state.room = action.payload.room
			state.gameMode = action.payload.gameMode 
		}
	}
})

const socketSlice = createSlice({
	name: "Socket",
	initialState: {},
	reducers:
	{
		connect: (state, action) => {
			return;
		},
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

export const { change } = slice.actions
export const {changeRoom} = roomSlice.actions
export const { connect, send, disconnect } = socketSlice.actions

const logger = (storeAPI) => (next) => (action) => {
	console.log("Dispatch called with action", action)
	const result = next(action)
	return (result)
}

export const store = configureStore({
	reducer: {
		name: slice.reducer,
		room: roomSlice.reducer,
		socket: socketSlice.reducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().prepend(logger).concat(socketMiddleware)
})
