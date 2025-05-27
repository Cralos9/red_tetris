import { useRef, useEffect } from "react"
import { socket } from "../socket"

export function Canvas() {
  const canvasRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    console.log(canvas)
	
	ctx.fillStyle = "#ffffff"

	socket.on("connect", () => {
	  console.log("Connected to the websocket")
	})

	socket.on('color', (color) => {
		console.log("Color Event:", color)
		ctx.fillStyle = color
	})

	socket.on('action', (msg) => {
		//console.log(msg.field)
		const field = msg.field
		for (let i = 0; i < 20; i++) {
			for (let x = 0; x < 10; x++) {
				if (field[i][x] === 1) {
					ctx.fillRect(x * 30, i * 25, 50, 50)
				} else {
					ctx.clearRect(x * 30, i * 25, 50, 50)
				}
			}
		}
	})

	document.addEventListener("keydown", e => {
		socket.emit("action", {key: e.key})
	})
  }, [])

  return (
	<canvas ref={canvasRef} width={300} height={500} style={{border: "1px solid #ffffff"}}/>
  )
}
