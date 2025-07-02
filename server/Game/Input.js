import { KeyBinds } from "./gameParams.js"

export class Input {
	constructor() {
		this.keys = new Map()
		for (const key in KeyBinds) {
			this.keys.set(KeyBinds[key], false)
		}
	}

	set(key, value) {
		this.keys.set(key, value)
	}

	isPressed(key) {
		return this.keys.get(key)
	}
}
