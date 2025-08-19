import { ACTIONS } from "../../common.js"

export default class GameController {
	constructor(keyboard, keybinds) {
		this.keyboard = keyboard
		this.actions = keybinds.actions
		this.DAS = Number(keybinds.DAS)
		this.ARR = Number(keybinds.ARR)
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
		if (moveAction === ACTIONS.MOVE_LEFT) {
			move *= -1
		} else if (moveAction === ACTIONS.MOVE_RIGHT) {
			move *= 1
		}
		return (move)
	}

	keyStates() {
		const hardDrop = this.consumeKey(ACTIONS.HARD_DROP)
		const hold = this.consumeKey(ACTIONS.HOLD)
		const softDrop = this.keyboard.isPressed(this.actions[ACTIONS.SOFT_DROP]) ? 1 : 0
		const rotateRight = this.consumeKey(ACTIONS.ROTATE_RIGHT)
		const rotateLeft = this.consumeKey(ACTIONS.ROTATE_LEFT)

		const move = this.getDir([ACTIONS.MOVE_LEFT, ACTIONS.MOVE_RIGHT])
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
