export class TargetManager {
	constructor(targets) {
		this.targets = targets
	}

	sendGarbage(linesCleared) {
		linesCleared = linesCleared - 1
		if (linesCleared > 0) {
			this.targets.forEach(target => {
				target.game.garbageQueue.push(linesCleared)
			})
		}
	}

	update(state, event) {
		switch (event) {
			case "LINE_CLEAR":
				this.sendGarbage(state)
				break
		}
	}
}
