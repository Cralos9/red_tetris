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
		this.keys = {
			'q': new Input(),
			'w': new Input(),
			'e': new Input(),
			'r': new Input(),
			't': new Input(),
			'y': new Input(),
			'u': new Input(),
			'i': new Input(),
			'o': new Input(),
			'p': new Input(),
			'a': new Input(),
			's': new Input(),
			'd': new Input(),
			'f': new Input(),
			'g': new Input(),
			'h': new Input(),
			'j': new Input(),
			'k': new Input(),
			'l': new Input(),
			'z': new Input(),
			'x': new Input(),
			'c': new Input(),
			'v': new Input(),
			'b': new Input(),
			'n': new Input(),
			'm': new Input(),
			' ': new Input(),
			'ArrowLeft': new Input(),
			'ArrowRight': new Input(),
			'ArrowUp':new Input(),
			'ArrowDown': new Input(),
		}
	}

	reset() {
		for (const key in this.keys) {
			this.keys[key].reset()
		}
	}

	setPress(keyName, timer) {
		const key = this.keys[keyName]

		if (key === undefined) {
			return (0)
		} else if (key.getPress() === true) {
			return (0)
		}
		key.update(true, timer)
		return (1)
	}

	setRelease(keyName, timer) {
		const key = this.keys[keyName]

		if (key === undefined) {
			return (0)
		}
		key.update(false, timer)
		return (1)
	}

	isPressed(keys) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			if (this.keys[key].getPress()) {
				return (true)
			}
		}
		return (false)
	}

	isTap(keys, timer) {
		for (let i = 0; i < keys.length; i++) {
			const keyName = keys[i]
			if ((timer - this.keys[keyName].getHeldTime()) < 1) {
				return (true)
			}
		}
		return (false)
	}

	getHeldTime(keys) {
		var time = 0
		for (let i = 0; i < keys.length; i++) {
			const keyName = keys[i]
			const heldTime = this.keys[keyName].getHeldTime()
			if (heldTime > time) {
				time = heldTime
			}
		}
		return (time)
	}
}
