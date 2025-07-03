const DAS = 20
const ARR = 1

export class GameController {
	constructor(input) {
		this.input = input
		this.actions = {
			HARD_DROP: [' '],
			SOFT_DROP: ['ArrowDown'],
			HOLD: ['c'],
			ROTATE_RIGHT: ['x', 'ArrowUp'],
			ROTATE_LEFT: ['z'],
			MOVE_RIGHT: ['ArrowRight'],
			MOVE_LEFT: ['ArrowLeft']
		}
		this.consum = []
		this.dasDelay = 0
		this.arr = 0
		this.rot = 0
		this.x = 0
		this.y = 0
	}

	get(keys) {
		for (let i = 0; i < keys.length; i++) {
			if (this.input.isPressed(keys[i])) {
				return (true)
			}
		}
		return (false)
	}

	axisX(left, right){
		if (left === true && right === false) {
			return (-1)
		} else if (right === true && left === false) {
			return (1)
		}
		return (0)
	}

	consumeKey(keys) {
		const isPressed = this.get(keys)

		if (isPressed === false) {
			this.consum = this.consum.filter(Ckey => Ckey !== keys)
			return (false)
		} else if (this.consum.find(Ckey => Ckey === keys)) {
			return (false)
		}
		this.consum.push(keys)
		return (true)
	}

	getMoveLeft(keys) {
		const isPressed = this.get(keys)
		
		if (isPressed === false) {
			this.dasDelay = 0
			return (false)
		}
		console.log("DASDelay:", this.dasDelay)
		if (this.dasDelay === 0) {
			this.dasDelay += 1
			return (true)
		} else if (this.dasDelay < DAS) {
			this.dasDelay += 1
			return (false)
			
		} else if (this.arr < ARR) {
			this.arr += 1
			return (false)
		}
		this.arr = 0
		return (true)
	}

	keyStates() {
		const hardDrop = this.consumeKey(this.actions.HARD_DROP)
		const softDrop = this.get(this.actions.SOFT_DROP)
		const moveLeft = this.getMoveLeft(this.actions.MOVE_LEFT)
		const moveRight = this.get(this.actions.MOVE_RIGHT)
		const rotateRight = this.consumeKey(this.actions.ROTATE_RIGHT)
		const rotateLeft = this.consumeKey(this.actions.ROTATE_LEFT)
		
		const axisX = this.axisX(moveLeft, moveRight)
		const rotAxis = this.axisX(rotateLeft, rotateRight)

		return {
			x: axisX,
			y: 0,
			hardDrop: hardDrop,
			rot: rotAxis
		}
	}
	
	consume(key) {
		const value = this.input.isPressed(key)
		this.input.set(key, false)
		return (value)
	}

	movePiece(input) {
		this.x = input
	}

	softDropPiece(input) {
		this.y = input
	}

	rotatePiece(input) {
		this.rot = input
	}
}
