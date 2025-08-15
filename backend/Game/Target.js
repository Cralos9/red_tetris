import { GARBAGE_DELAY, GAME_EVENTS } from "./gameParams.js"
import Stack from "../Utils/Stack.js"

export class TargetManager {
	constructor(garbageCallback, eventManager, targets) {
		this.targets = targets
		this.createGarbage = garbageCallback
		this.garbageStack = new Stack()
		eventManager.subscribe(GAME_EVENTS.LINE_CLEAR, this.receiveGarbage.bind(this))
		eventManager.subscribe(GAME_EVENTS.LINE_CLEAR, this.sendGarbage.bind(this))
	}

	getGarbageStack() { return (this.garbageStack) }
	getTargets() { return (this.targets) }

	sendGarbage(state) {
		var linesCleared = state.linesCleared
		const combo = state.combo

		linesCleared = this.cancelGarbage(linesCleared)
		const garbageLines = (linesCleared - 1) + (combo - 1)
		if (garbageLines > 0) {
			this.targets.forEach(target => {
				const garbageInfo = {lines: garbageLines, timer: Date.now()}
				target.getTargetManager().garbageStack.push(garbageInfo)
			})
		}
	}

	receiveGarbage(state) {
		const linesCleared = state.linesCleared

		if (linesCleared > 0) {
			return
		}

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

	toObject() {
		return {
			garbage: this.garbageStack.getArr()
		}
	}
}
