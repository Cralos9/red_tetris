export class Input {
	constructor() {
		this.pressed = false
		this.heldTimer = 0
	}

	setPress(value) {
		this.pressed = value
	}

	update() {
		if (this.pressed) {
			this.heldTimer += 1
		} else {
			this.heldTimer = 0
		}
	}

	getHeldTime() { return (this.heldTimer) }
	getPress() { return (this.pressed) }
}

export class Keyboard {
	constructor() {
		this.keys = {
			'z': new Input(),
			'x': new Input(),
			'c': new Input(),
			' ': new Input(),
			'ArrowLeft': new Input(),
			'ArrowRight': new Input(),
			'ArrowUp':new Input(),
			'ArrowDown': new Input(),
		}
	}

	update() {
		for (const key in this.keys) { 
			this.keys[key].update()
		}
	}

	set(key, press) {
		this.keys[key].setPress(press)
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
