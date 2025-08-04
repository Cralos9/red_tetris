import { GARBAGE_DELAY } from "./gameParams.js"

export class TargetManager {
	constructor() {
		this.targets = []
		this.garbageQueue = []
	}

	getTargets() { return (this.targets) }

	addTarget(newTarget) {
		this.targets.push(newTarget)
	}

	removeTarget(removeTarget) {
		this.targets = this.targets.filter(target => target !== removeTarget)
	}

	sendGarbage(linesCleared) {
		linesCleared = this.cancelGarbage(linesCleared)
		if (linesCleared > 1) {
			this.targets.forEach(target => {
				const garbageInfo = {lines: linesCleared - 1, timer: Date.now()}
				target.getTargetManager().garbageQueue.push(garbageInfo)
			})
		}
	}

	receiveGarbage(callback) {
		var i = 0
		while (i < this.garbageQueue.length) {
			const garbage = this.garbageQueue[i]
			const elapsedTime = Date.now() - garbage.timer
			if (elapsedTime >= GARBAGE_DELAY) {
				callback(garbage.lines)
				this.garbageQueue.shift()
				continue
			}
			i++
		}
	}

	cancelGarbage(linesCleared) {
		while (this.garbageQueue.length !== 0 && linesCleared >= this.garbageQueue[0].lines) {
			linesCleared -= this.garbageQueue[0].lines
			this.garbageQueue.shift()
		}
		if (this.garbageQueue.length > 0 && linesCleared > 0) {
			this.garbageQueue[0].lines -= linesCleared
		}
		return (linesCleared)
	}

	update(state, event) {
		const callback = state.callback
		const linesCleared = state.linesCleared

		this.sendGarbage(linesCleared)
		if (linesCleared === 0) {
			this.receiveGarbage(callback)
		}

		//switch (event) {
		//	case "LINE_CLEAR":
		//		this.sendGarbage(state)
		//		break
		//}
	}
}
