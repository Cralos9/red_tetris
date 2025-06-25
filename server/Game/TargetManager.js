import { Subject } from "../Observer/Subject.js"

export class TargetManager extends Subject{
	constructor(targets) {
		super()
		this.targets = targets
		this.targttingType = "RANDOM"
		//this.targetOpponent = this.targets[0]
		//this.addObserver(this.targetOpponent)
	}

	sendGarbage(garbageLines) {
		this.targets.forEach(target => {
			target.game.receiveGarbage(garbageLines)
		})
		//this.targetOpponent.game.receiveGarbage(garbageLines)
	}

	update(state, event) {
		switch (event) {
			case "LINE_CLEAR":
				this.sendGarbage(state.linesCleared - 1)
				break
			case "CHANGE_TARGET":
				console.log("Future Target swap")
				break
		}
	}
}
