import { KeyBinds } from "./gameParams.js"

export class GameController {
	constructor() {
		this.keys = new Map()

		for (const key in KeyBinds) {
			this.keys.set(KeyBinds[key], false)
		}

		this.rot = 0
		this.x = 0
		this.y = 0
	}
	
	isPressed(key) {
		return (this.keys.get(key))
	}

	set(key, value) {
		this.keys.set(key, value)
	}

	consume(key) {
		const value = this.keys.get(key)
		this.keys.set(key, false)
		return (value)
	}

	movePiece(input) {
		this.x = input
	}

	softDropPiece(input) {
		this.y = input
	}

	rotatePiece(input) {
		this.rot = input
	}
}
