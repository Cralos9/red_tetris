import { ACTIONS } from "../../common.js"
import Keyboard from "./Input.js"

class Info {
	constructor() {
		this.pressed = false
		this.consumed = false
	}

	update(value) {
		this.pressed = value
	}

	isTap() {
		return (this.pressed && !this.consumed)
	}

	isPressed() {
		return (this.pressed)
	}

	consume() {
		this.consumed = this.pressed
	}
}

export default class GameController extends Keyboard {
	constructor(keybinds) {
		super()
		this.DAS = Number(keybinds.DAS)
		this.ARR = Number(keybinds.ARR)
		this.dasCounter = 0
		this.pieceDir = []
		this.consum = []
		this.inputs = new Map()
		Object.values(ACTIONS).forEach(action => {
			this.inputs.set(action, new Info())
		})
		this.moveStack = []
	}

	axis(left, right){
		if (left === true && right === false) {
			return (-1)
		} else if (right === true && left === false) {
			return (1)
		}
		return (0)
	}

	consumeAction(action) {
		const info = this.getAction(action)
		const ret = info.isTap()
		info.consume()
		return (ret)
	}

	rotation() {
		const left = this.consumeAction(ACTIONS.ROTATE_LEFT)
		const right = this.consumeAction(ACTIONS.ROTATE_RIGHT)
		return (this.axis(left, right))
	}

	move() {
		const left = this.getAction(ACTIONS.MOVE_LEFT)
		const right = this.getAction(ACTIONS.MOVE_RIGHT)

		if (left.pressed === false) {
			this.moveStack = this.moveStack.filter(dir => dir !== -1)
			return (0)
		} else if (right.pressed === false) {
			this.moveStack = this.moveStack.filter(dir => dir !== 1)
			return (0)
		}

		const tapLeft = left.isTap()
		const tapRight = right.isTap()

		const dir = this.axis(tapLeft, tapRight)
		if (dir) {
			this.moveStack.push(dir)
			this.dasCounter++
			return (this.moveStack[this.moveStack.length - 1])
		}

		this.dasCounter++
		if (this.dasCounter < this.DAS) {
			return (0)
		}
		this.dasCounter -= this.ARR

		return (this.moveStack[this.moveStack.length - 1])
	}

	getRet() {
		return {
			rot: this.rotation(),
			hardDrop: this.consumeAction(ACTIONS.HARD_DROP),
			hold: this.consumeAction(ACTIONS.HOLD),
			softDrop: this.getAction(ACTIONS.SOFT_DROP).isPressed(),
			move: this.move(),
		}
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

