"use client"

import { configureStore, createSlice } from "@reduxjs/toolkit"
import { SOCK_EVENTS } from "./socket"

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
		[SOCK_EVENTS.CONNECT]: (state, action) => {
			return;
		},
		[SOCK_EVENTS.SEND]: (state, action) => 
		{
			return;
		},
		[SOCK_EVENTS.DISCONNECT] : (state, action) =>
		{
			return;
		},
 	}
})

export const { change } = slice.actions
export const {changeRoom} = roomSlice.actions

export const store = configureStore({
	reducer: {
		name: slice.reducer,
		room: roomSlice.reducer,
	},
})
