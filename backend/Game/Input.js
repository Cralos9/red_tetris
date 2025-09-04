import { SupportedKeys } from "../../common.js"

class Input {
	constructor() {
		this.pressed = false
		this.heldTime = 0
	}

	update(value, timer) {
		this.pressed = value
		this.heldTime = timer
	}

	reset() {
		this.pressed = false
		this.heldTime = 0
	}

	getHeldTime() { return (this.heldTime) }
	getPress() { return (this.pressed) }
}

export default class Keyboard {
	constructor() {
		this.keys = new Map()
		SupportedKeys.forEach(key => {
			this.keys.set(key, new Input())
		})
	}

	reset() {
		for (const key of this.keys.values()) {
			key.reset()
		}
	}

	setPress(keyName, timer) {
		const key = this.keys.get(keyName)

		if (key === undefined) {
			return (0)
		} else if (key.getPress() === true) {
			return (0)
		}
		key.update(true, timer)
		return (1)
	}

	setRelease(keyName, timer) {
		const key = this.keys.get(keyName)

		if (key === undefined) {
			return (0)
		}
		key.update(false, timer)
		return (1)
	}

	isPressed(keys) {
		for (let i = 0; i < keys.length; i++) {
			if (this.keys.get(keys[i]).getPress()) {
				return (true)
			}
		}
		return (false)
	}

	isTap(keys, timer) {
		for (let i = 0; i < keys.length; i++) {
			if ((timer - this.keys.get(keys[i]).getHeldTime()) < 1) {
				return (true)
			}
		}
		return (false)
	}

	getHeldTime(keys) {
		var time = 0
		for (let i = 0; i < keys.length; i++) {
			const heldTime = this.keys.get(keys[i]).getHeldTime()
			if (heldTime > time) {
				time = heldTime
			}
		}
		return (time)
	}
}
