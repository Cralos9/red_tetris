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

export const { change } = slice.actions

const logger = (storeAPI) => (next) => (action) => {
	console.log("Dispatch called with action", action)
	const result = next(action)
	return (result)
}

export const store = configureStore({
	reducer: {
		name: slice.reducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().prepend(logger).concat(socketMiddleware)
})
