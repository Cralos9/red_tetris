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
		this.actions = keybinds.actions
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

	consumeKey(action) {
		const keys = this.actions[action]
		const isPressed = this.isPressed(keys)

		if (isPressed === false) {
			this.consum = this.consum.filter(Caction => Caction !== action)
			return (false)
		} else if (this.consum.find(Caction => Caction === action)) {
			return (false)
		}
		this.consum.push(action)
		return (true)
	}

	getMove(action, frame) {
		const isTap = this.isTap(this.actions[action], frame)

		if (isTap === true) {
			this.dasCounter = 0
			return (true)
		}
		this.dasCounter++
		if (this.dasCounter < this.DAS) { return (false) }
		this.dasCounter -= this.ARR
		return (true)
	}

	getDir(actionArr, frame) {
		actionArr.forEach(action => {
			const keys = this.actions[action]
			const isPressed = this.isPressed(keys)
			const isTap = this.isTap(keys, frame)

			if (isPressed === false) {
				this.pieceDir = this.pieceDir.filter(actions => action !== actions)
			} else if (isTap === true) {
				this.pieceDir.push(action)
			}

		})
		if (this.pieceDir.length <= 0) {
			return (0)
		}
		const moveAction = this.pieceDir[this.pieceDir.length - 1]
		var move = this.getMove(moveAction, frame)
		if (moveAction === ACTIONS.MOVE_LEFT) {
			move *= -1
		} else if (moveAction === ACTIONS.MOVE_RIGHT) {
			move *= 1
		}
		return (move)
	}

	keyStates(frame) {
		const hardDrop = this.consumeKey(ACTIONS.HARD_DROP)
		const hold = this.consumeKey(ACTIONS.HOLD)
		const softDrop = this.isPressed(this.actions[ACTIONS.SOFT_DROP]) ? 1 : 0
		const rotateRight = this.consumeKey(ACTIONS.ROTATE_RIGHT)
		const rotateLeft = this.consumeKey(ACTIONS.ROTATE_LEFT)

		const move = this.getDir([ACTIONS.MOVE_LEFT, ACTIONS.MOVE_RIGHT], frame)
		const rot = this.axis(rotateLeft, rotateRight)

		return {
			move: move,
			softDrop: softDrop,
			hardDrop: hardDrop,
			hold: hold,
			rot: rot
		}
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

