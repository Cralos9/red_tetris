import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { send } from "../../Store"
import { sendSocketMsg } from "../../socket"
import {ACTIONS} from "../../../common.js"

export default function Inputs({ roomCode, children }) {
	const dispatch = useDispatch()
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
	const keyDown = (e) => {
		const key = e.key
		if (set.has(key)) {
			return
		}
		const msg = sendSocketMsg("keyDown", { roomCode: roomCode, key: key })
		dispatch(send(msg))
		set.add(key)
	}
	const keyUp = (e) => {
		const key = e.key
		set.delete(key)
		const msg = sendSocketMsg("keyUp", { roomCode: roomCode, key: key })
		dispatch(send(msg))
	}

	useEffect(() => {
		console.log("RoomCode:", roomCode)
		window.addEventListener("keydown", keyDown)
		window.addEventListener("keyup", keyUp)

		return () => {
			window.removeEventListener("keyup", keyUp)
			window.removeEventListener("keydown", keyDown)
		}
	}, [])

	return (
		<>{ children }</>
	)
} 
