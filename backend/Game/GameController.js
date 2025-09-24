import { ACTIONS } from "../../common.js"

class Info {
	constructor() {
		this.pressed = false
		this.consumed = false
	}

	update(value) {
		this.pressed = value
	}

	isTap() {
		const ret = this.pressed && !this.consumed
		this.consumed = this.pressed
		return (ret)
	}

	isPressed() {
		return (this.pressed)
	}
}

export default class GameController {
	constructor() {
		this.inputs = new Map()
		Object.values(ACTIONS).forEach(action => {
			this.inputs.set(action, new Info())
		})
	}

	getAction(action) { return (this.inputs.get(action)) }

	setAction(action, value) {
		const input = this.getAction(action)
		if (input === undefined) { 
			return
		}
		input.update(value)
	}
}

