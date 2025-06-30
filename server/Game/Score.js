import { Observer } from "../Observer/Observer.js"
import { ScoreTable } from "./gameParams.js"

export class ScoreManager extends Observer {
	constructor() {
		super()
		this.score = 0
		this.combo = 0
	}

	lineClearScore(linesCleared) {
		if (linesCleared <= 0) {
			this.combo = 0
			return
		}
		this.score += ScoreTable[linesCleared]
		this.score += this.combo * ScoreTable["COMBO"]
		console.log("Score:", this.score)
	}

	dropScore(dropType, pieceRow, dropPieceRow) {
		console.log("State:", pieceRow, dropPieceRow)
		console.log("Hard Drop:", ScoreTable["HARD_DROP"])
		this.score += ScoreTable[dropType] * (pieceRow - dropPieceRow)
		console.log("Score:", this.score)
	}

	update(state, event) {
		switch (event) {
			case "LINE_CLEAR":
				this.lineClearScore(state)
				break
			case "HARD_DROP":
				this.dropScore(event, state.pieceRow, state.dropRow)
				break
		}
	}

	toObject() {
		return {
			score: this.score
		}
	}
}
