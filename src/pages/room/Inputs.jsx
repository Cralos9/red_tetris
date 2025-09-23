import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { send } from "../../Store"
import { sendSocketMsg } from "../../socket"
import {ACTIONS} from "../../../common.js"

export default function Inputs({ roomCode, children }) {
	const dispatch = useDispatch()
	const keybinds = useSelector((state) => state.player.keybinds)
	const set = new Set()

	const options = {
		actions: {
			[ACTIONS.MOVE_LEFT]: localStorage.getItem("left") ? [localStorage.getItem("left")] : ['ArrowLeft'],
			[ACTIONS.MOVE_RIGHT]: localStorage.getItem("right") ? [localStorage.getItem("right")] : ['ArrowRight'],
			[ACTIONS.ROTATE_LEFT]: localStorage.getItem("rotateLeft") ? [localStorage.getItem("rotateLeft")] : ['z'],
			[ACTIONS.ROTATE_RIGHT]: localStorage.getItem("rotateRight") ? [localStorage.getItem("rotateRight")] : ['ArrowUp', 'x'],
			[ACTIONS.HARD_DROP]: localStorage.getItem("hardDrop") ? [localStorage.getItem("hardDrop")] : [' '],
			[ACTIONS.SOFT_DROP]: localStorage.getItem("softDrop") ? [localStorage.getItem("softDrop")] : ['ArrowDown'],
			[ACTIONS.HOLD]: localStorage.getItem("holdPiece") ? [localStorage.getItem("holdPiece")] : ['c'],
		},
	}
	options.keys = {}
	for (const [action, keys] of Object.entries(options.actions)) 
	{
		for (const key of keys) 
		{
			options.keys[key] = action
		}
	}

	const keyHandler = (action, event) => {
		const msg = sendSocketMsg(event, { roomCode: roomCode, action: action })
		dispatch(send(msg))
	}

	const down = (e) => {
		const action = options.keys[e.key]
		if (set.has(action)) {
			return
		}
		keyHandler(action, "down")
		set.add(action)
	}

	const up = (e) => {
		const action = options.keys[e.key]
		set.delete(action)
		keyHandler(action, "up")
	}

	useEffect(() => {
		window.addEventListener("keydown", down)
		window.addEventListener("keyup", up)

		return () => {
			window.removeEventListener("keyup", up)
			window.removeEventListener("keydown", down)
		}
	})

	return (
		<>{ children }</>
	)
} 
