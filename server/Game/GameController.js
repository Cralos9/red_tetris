import { Actions } from "./gameParams.js"

export class GameController {
	constructor(keyboard, keybinds) {
		this.keyboard = keyboard
		this.actions = keybinds.actions
		this.DAS = keybinds.DAS
		this.ARR = keybinds.ARR
		this.pieceDir = []
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
		const isTap = this.keyboard.isTap(this.actions[action])
		const heldtimer = this.keyboard.getHeldTime(this.actions[action])

		if (isTap === true) {
			return (true)
		}

		if (heldtimer < this.DAS) {
			return (false)
		}

		if (((heldtimer - this.DAS) + this.ARR) % this.ARR) {
			return (false)
		}

		return (true)
	}

	getDir(actionArr) {
		actionArr.forEach(action => {
			const keys = this.actions[action]
			const isPressed = this.keyboard.isPressed(keys)
			const isTap = this.keyboard.isTap(keys)

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
		var move = this.getMove(moveAction)
		if (moveAction === Actions.MOVE_LEFT) {
			move *= -1
		} else if (moveAction === Actions.MOVE_RIGHT) {
			move *= 1
		}
		return (move)
	}

	keyStates() {
		this.keyboard.update()

		const hardDrop = this.consumeKey(Actions.HARD_DROP)
		const hold = this.consumeKey(Actions.HOLD)
		const softDrop = this.keyboard.isPressed(this.actions[Actions.SOFT_DROP]) ? 1 : 0
		const rotateRight = this.consumeKey(Actions.ROTATE_RIGHT)
		const rotateLeft = this.consumeKey(Actions.ROTATE_LEFT)

		const move = this.getDir([Actions.MOVE_LEFT, Actions.MOVE_RIGHT])
		const rot = this.axis(rotateLeft, rotateRight)

		return {
			move: move,
			softDrop: softDrop,
			hardDrop: hardDrop,
			hold: hold,
			rot: rot
		}
	}
}
