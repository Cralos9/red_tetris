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
		this.moveStack = []
	}

	checkMove(action, scale) {
		const info = this.getAction(action)

		if (!info.isPressed()) {
			this.moveStack.filter(dir => dir !== scale)
			return(0)
		}
		
		if (info.isTap()) {
			this.moveStack.push(scale)
		}
		return (scale)
	}

	move() {
		const left = this.checkMove(ACTIONS.MOVE_LEFT, -1)
		const right = this.checkMove(ACTIONS.MOVE_RIGHT, 1)

		if (left && right) {
			return (this.moveStack[this.moveStack.length - 1])
		}
		return (left || right)
	}

	rotation() {
		const left = this.getAction(ACTIONS.ROTATE_LEFT).isTap() * -1
		const right = this.getAction(ACTIONS.ROTATE_RIGHT).isTap() * 1
		return (left || right)
	}

	getRet() {
		return {
			rot: this.rotation(),
			move: this.move(),
			hardDrop: this.getAction(ACTIONS.HARD_DROP).isTap(),
			hold: this.getAction(ACTIONS.HOLD).isTap(),
			softDrop: this.getAction(ACTIONS.SOFT_DROP).isPressed(),
		}
	}

	isTap(action) {
		return (this.getAction(action).isTap())
	}

	isPressed(action) {
		return (this.getAction(action).isPressed())
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

