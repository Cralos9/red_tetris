import { Actions } from "./gameParams.js"

const DAS = 20
const ARR = 1

const moveInfo = { dasDelay: 0, arrDelay: 0, }

export class GameController {
	constructor(keyboard) {
		this.keyboard = keyboard
		this.actions = {
			[Actions.HARD_DROP]: [' '],
			[Actions.SOFT_DROP]: ['ArrowDown'],
			[Actions.HOLD]: ['c'],
			[Actions.ROTATE_RIGHT]: ['x', 'ArrowUp'],
			[Actions.ROTATE_LEFT]: ['z'],
			[Actions.MOVE_RIGHT]: ['ArrowRight'],
			[Actions.MOVE_LEFT]: ['ArrowLeft']
		}
		this.actionState = {
			[Actions.MOVE_LEFT]: { ...moveInfo },
			[Actions.MOVE_RIGHT]: { ...moveInfo },
		}
		this.consum = []
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
		const isPressed = this.keyboard.isPressed(keys)

		if (isPressed === false) {
			this.consum = this.consum.filter(Caction => Caction !== action)
			return (false)
		} else if (this.consum.find(Caction => Caction === action)) {
			return (false)
		}
		this.consum.push(action)
		return (true)
	}

	getMove(action) {
		const moveInfo = this.actionState[action]
		const isPressed = this.keyboard.isPressed(this.actions[action])

		if (isPressed === false) {
			moveInfo.dasDelay = 0
			moveInfo.arrDelay = 0
			return (false)
		}
		if (moveInfo.dasDelay === 0) {
			moveInfo.dasDelay += 1
			return (true)
		} else if (moveInfo.dasDelay < DAS) {
			moveInfo.dasDelay += 1
			return (false)
		} else if (moveInfo.arrDelay < ARR) {
			moveInfo.arrDelay += 1
			return (false)
		}
		moveInfo.arr = 0
		return (true)
	}

	keyStates() {
		const hardDrop = this.consumeKey(Actions.HARD_DROP)
		const hold = this.consumeKey(Actions.HOLD)
		const softDrop = this.keyboard.isPressed(this.actions[Actions.SOFT_DROP]) ? 1 : 0
		const moveLeft = this.getMove(Actions.MOVE_LEFT)
		const moveRight = this.getMove(Actions.MOVE_RIGHT)
		const rotateRight = this.consumeKey(Actions.ROTATE_RIGHT)
		const rotateLeft = this.consumeKey(Actions.ROTATE_LEFT)

		const move = this.axis(moveLeft, moveRight)
		const rot = this.axis(rotateLeft, rotateRight)

		this.keyboard.update()
		return {
			move: move,
			softDrop: softDrop,
			hardDrop: hardDrop,
			hold: hold,
			rot: rot
		}
	}
}
