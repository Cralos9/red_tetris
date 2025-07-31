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
		this.garbageQueue.push(garbageLines)
	}

	update(state, event) {
		switch (event) {
			case "LINE_CLEAR":
				this.sendGarbage(state)
				break
		}
	}
}
