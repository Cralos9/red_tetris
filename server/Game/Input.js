export class Input {
	constructor() {
		this.keys = {
			'z': false,
			'x': false,
			'ArrowLeft': false,
			'ArrowUp': false,
			'ArrowDown': false,
			'ArrowRight': false,
			'c': false,
			' ': false
		}
	}

	set(key, value) {
		this.keys[key] = value
	}

	isPressed(key) {
		return (this.keys[key])
	}
}
