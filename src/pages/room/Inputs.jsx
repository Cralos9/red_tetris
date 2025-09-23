import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { send } from "../../Store"
import { sendSocketMsg } from "../../socket"

export default function Inputs({ roomCode, children }) {
	const dispatch = useDispatch()
	const set = new Set()

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
