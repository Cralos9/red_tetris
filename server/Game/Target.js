import { GARBAGE_DELAY } from "./gameParams.js"
import { Stack } from "../Stack.js"

export class TargetManager {
	constructor(garbageCallback, targets) {
		this.targets = targets
		this.createGarbage = garbageCallback
		this.garbageStack = new Stack()
	}

	getGarbageStack() { return (this.garbageStack) }
	getTargets() { return (this.targets) }

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

	receiveGarbage() {
		const garbageArr = this.garbageStack.getArr()
		var i = 0
		while (i < garbageArr.length) {
			const elapsedTime = Date.now() - garbageArr[i].timer
			if (elapsedTime >= GARBAGE_DELAY) {
				this.createGarbage(garbageArr[i].lines)
				this.garbageStack.pop()
				continue
			}
			i++
		}
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
		const linesCleared = state.linesCleared
		const combo = state.combo

		this.sendGarbage(linesCleared, combo)
		if (linesCleared === 0) {
			this.receiveGarbage()
		}
	}

	toObject() {
		return {
			garbage: this.garbageStack.getArr()
		}
	}
}
