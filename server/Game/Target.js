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
		linesCleared = linesCleared - 1
		if (linesCleared > 0) {
			this.targets.forEach(target => {
				target.getTargetManager().receiveGarbage(linesCleared)
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
			console.log("GarbageTimer:", elapsedTime)
			if (elapsedTime >= 5010) {
				callback(garbage.lines)
				this.garbageQueue.shift()
				garbageCounter += 1
				continue
			}
			i++
		}
		console.log("GarbageCounter:", garbageCounter)
	}

	update(state, event) {
		if (event === "LINE_CLEAR") {
			const callback = state.callback
			const linesCleared = state.linesCleared

			this.sendGarbage(linesCleared)
			this.handleGarbage(callback)
		}

		//switch (event) {
		//	case "LINE_CLEAR":
		//		this.sendGarbage(state)
		//		break
		//}
	}
}
