"use client"

import { configureStore, createSlice } from "@reduxjs/toolkit"

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

export const store = configureStore({
	reducer: {
		name: slice.reducer
	}
})
