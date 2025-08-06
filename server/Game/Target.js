import { GARBAGE_DELAY } from "./gameParams.js"
import { Stack } from "../Stack.js"

export class TargetManager {
	constructor() {
		this.targets = []
		this.garbageStack = new Stack()
	}

	reset() {
		this.garbageQueue = new Stack()
	}

	getGarbageStack() { return (this.garbageStack) }
	getTargets() { return (this.targets) }

	addTarget(newTarget) {
		this.targets.push(newTarget)
	}

	removeTarget(removeTarget) {
		this.targets = this.targets.filter(target => target !== removeTarget)
	}

	sendGarbage(linesCleared, combo) {
		linesCleared = this.cancelGarbage(linesCleared)
		const garbageLines = (linesCleared - 1) + (combo - 1)
		if (garbageLines > 0) {
			this.targets.forEach(target => {
				const garbageInfo = {lines: garbageLines, timer: Date.now()}
				target.getTargetManager().garbageStack.push(garbageInfo)
			})
		}
	}

	receiveGarbage(callback) {
		this.garbageStack.iteration(garbage => {
			const elapsedTime = Date.now() - garbage.timer
			if (elapsedTime >= GARBAGE_DELAY) {
				callback(garbage.lines)
				this.garbageStack.pop()
			}
		})
	}

	cancelGarbage(linesCleared) {
		while (this.garbageStack.empty() === false && linesCleared >= this.garbageStack.top().lines) {
			linesCleared -= this.garbageStack.top().lines
			this.garbageStack.pop()
		}
		if (this.garbageStack.size() > 0 && linesCleared > 0) {
			this.garbageStack.top().lines -= linesCleared
		}
		return (linesCleared)
	}

	update(state, event) {
		const callback = state.callback
		const linesCleared = state.linesCleared
		const combo = state.combo

		this.sendGarbage(linesCleared, combo)
		if (linesCleared === 0) {
			this.receiveGarbage(callback)
		}

		//switch (event) {
		//	case "LINE_CLEAR":
		//		this.sendGarbage(state)
		//		break
		//}
	}

	toObject() {
		return {
			garbage: this.garbageStack.getArr()
		}
	}
}
