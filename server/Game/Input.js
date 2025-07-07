export class Input {
	constructor() {
		this.pressed = false
	}

	update(value) {
		this.pressed = value
	}

	getPress() {
		return (this.pressed)
	}
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

	set(key, press) {
		this.keys[key].update(press)
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
}
