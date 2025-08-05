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
	}

	dropScore(dropType, pieceRow, dropPieceRow) {
		this.score += ScoreTable[dropType] * (pieceRow - dropPieceRow)
	}

	update(state, event) {
		switch (event) {
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
