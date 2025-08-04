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
				target.getTargetManager().receiveGarbage(linesCleared - 1)
			})
		}
	}

	receiveGarbage(garbageLines) {
		const garbageInfo = {lines: garbageLines, timer: Date.now()}
		this.garbageQueue.push(garbageInfo)
	}

	handleGarbage(callback) {
		var i = 0
		var garbageCounter = 0
		while (i < this.garbageQueue.length) {
			const garbage = this.garbageQueue[i]
			const elapsedTime = Date.now() - garbage.timer
			if (elapsedTime >= 10000) {
				callback(garbage.lines)
				this.garbageQueue.shift()
				garbageCounter += 1
				continue
			}
			i++
		}
	}

	cancelGarbage(linesCleared) {
		console.log("Before GarbageQ:", this.garbageQueue)
		while (this.garbageQueue.length !== 0 && linesCleared >= this.garbageQueue[0].lines) {
			linesCleared -= this.garbageQueue[0].lines
			this.garbageQueue.shift()
		}
		if (this.garbageQueue.length > 0 && linesCleared > 0) {
			this.garbageQueue[0].lines -= linesCleared
		}
		console.log("After GarbageQ:", this.garbageQueue)
		return (linesCleared)
	}

	update(state, event) {
		if (event === "LINE_CLEAR") {
			const callback = state.callback
			const linesCleared = state.linesCleared

			this.sendGarbage(linesCleared)
			if (linesCleared === 0) {
				this.handleGarbage(callback)
			}
		}

		//switch (event) {
		//	case "LINE_CLEAR":
		//		this.sendGarbage(state)
		//		break
		//}
	}
}
