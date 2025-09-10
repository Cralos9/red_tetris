import { ACTIONS } from "../../common.js"
import Keyboard from "./Input.js"

const info = {
	press: false,
	tap: false,
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
		this.ret = new Map()
		Object.values(ACTIONS).forEach(action => {
			this.ret.set(action, Object.create(info))
		})
		this.lastTap = 0
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

	getRot() {
		const left = this.consume(ACTIONS.ROTATE_LEFT)
		const right = this.consume(ACTIONS.ROTATE_RIGHT)
		
		return (this.axis(left, right))
	}

	getHardDrop() {
		return (this.consume(ACTIONS.HARD_DROP))
	}

	getHold() {
		return (this.consume(ACTIONS.HOLD))
	}

	getSoftDrop() {
		return (this.ret.get(ACTIONS.SOFT_DROP).press)
	}

	getMove() {
		const left = this.consume(ACTIONS.MOVE_LEFT)
		const right = this.consume(ACTIONS.MOVE_RIGHT)
		
		return (this.axis(left, right))
	}

	consume(action) {
		const info = this.ret.get(action)
		const ret = info.tap
		info.tap = false
		return (ret)
	}

	setAction(action, value) {
		const info = this.ret.get(action)
		if (info === undefined) {
			return
		}
		info.press = value
		info.tap = info.press && !info.tap
	}
}
