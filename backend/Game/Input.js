class Input {
	constructor() {
		this.pressed = false
		this.tap = false
		this.heldTimer = 0
	}

	setPress(value) {
		this.pressed = value
	}

	update() {
		if (this.pressed) {
			this.heldTimer += 1
			this.tap = this.heldTimer <= 1
		} else {
			this.heldTimer = 0
			this.tap = false
		}
	}

	reset() {
		this.pressed = false
		this.tap = false
		this.heldTimer = 0
	}

	getHeldTime() { return (this.heldTimer) }
	getTap() { return (this.tap) }
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

	update() {
		for (const key in this.keys) { 
			this.keys[key].update()
		}
	}

	set(key, press) {
		if (this.keys[key] === undefined) {
			return (0)
		}
		this.keys[key].setPress(press)
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

	isTap(keys) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			if (this.keys[key].getTap()) {
				return (true)
			}
		}
		return (false)
	}

	getHeldTime(keys) {
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]
			if (this.keys[key].getPress()) {
				return (this.keys[key].getHeldTime())
			}
		}
		return (0)
	}
}
