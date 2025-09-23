"use client"

import { configureStore, createSlice } from "@reduxjs/toolkit"
import { socketMiddleware } from "./socket"
import { ACTIONS } from "../common"
import { names } from "debug/src/browser"

const playerSlice = createSlice({
	name: "Player",
	initialState: {
		id: null,
		name: null,
		room: null,
		isOwner: false,
		keybinds: {
			" ": ACTIONS.HARD_DROP,
			"c": ACTIONS.HOLD,
			"ArrowLeft": ACTIONS.MOVE_LEFT,
			"ArrowRight": ACTIONS.MOVE_RIGHT,
			"ArrowUp": ACTIONS.ROTATE_RIGHT,
			"z": ACTIONS.ROTATE_LEFT,
			"ArrowDown": ACTIONS.SOFT_DROP,
		}
	},
	reducers: {
		setId: (state, action) => {
			state.id = action.payload
		},
		setName: (state, action) => {
			state.name = action.payload
		},
		setRoom: (state, action) => {
			state.room = action.payload
		},
		setOwner: (state, action) => {
			state.isOwner = action.payload
		},
		setKeys: (state, action) => {
			
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

const joinSlice = createSlice({
	name: "Join",
	initialState: {
		playerIds: null,
		playerNames: null,
	},
	reducers:{
		joiners: (state, action) =>
		{
			state.playerIds = action.payload.playerIds;
			state.playerNames = action.payload.playerNames;
		}
	}

})

const gameSlice = createSlice({
	name: "Game",
	initialState: {
		field: null,
		nextPiece: null,
		holdPiece: 0,
		score: null,
		combo: 0,
		linesCleared: 0,
		level: 0,
		id: null,
		running: false,
		leaderboard: null
	},
	reducers: {
		tick: (state, action) => {
			state.field = action.payload.field
			state.nextPiece = action.payload.nextPiece
			state.holdPiece = action.payload.holdPiece
			state.score = action.payload.playerScore
			state.combo = action.payload.combo
			state.linesCleared = action.payload.linesCleared
			state.level = action.payload.level
			state.id = action.payload.id
			state.running = action.payload.running
		},
		endGame: (state, action) => {
			state.leaderboard = action.payload.leaderboard.reverse()
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

export const { opponents } = opponentGame.actions
export const { setId, setName, setRoom, setOwner } = playerSlice.actions
export const { send, disconnect, owner } = socketSlice.actions
export const { tick, endGame } = gameSlice.actions
export const { joiners } = joinSlice.actions

const logger = (storeAPI) => (next) => (action) => {
	const result = next(action)
	return (result)
}

export const store = configureStore({
	reducer: {
		join: joinSlice.reducer,
		player: playerSlice.reducer,
		socket: socketSlice.reducer,
		game: gameSlice.reducer,
		opponents: opponentGame.reducer
	},
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware().prepend(logger).concat(socketMiddleware)
})
