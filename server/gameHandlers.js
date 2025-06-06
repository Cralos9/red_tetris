export const gameHandlers = (io, socket, RoomsMap) => {
	const gameInput = (payload) => {
		const key = payload.key
		const playerName = payload.Name
		const player = RoomsMap.get('123').playersArr.find(player => playerName === player.name)
		switch (key) {
			case " ":
				player.input.hardDrop(true)
				break
			case "ArrowLeft":
				player.input.move(-1)
				break
			case "ArrowRight":
				player.input.move(1)
				break
			case "x":
			case "ArrowUp":
				player.input.rotate(1)
				break
			case "z":
				player.input.rotate(-1)
				break
			case "ArrowDown":
				player.input.pushDown(1)
				break
			case "c":
				player.input.holdPiece(true)
				break

			default:
				console.log("Not Rec Key")
				break
		}
	}
	const startGame = (payload) => {
		const roomCode = payload.roomCode
		const Room = RoomsMap.get(roomCode)
		console.log("Starting Game")
		Room.playersArr.forEach(player => {
			player.runGame(roomCode)
		})
	}
	socket.on('startGame', startGame)
	socket.on('action', gameInput)
}
