import { Observer } from "../Observer/Observer.js"
import { ScoreTable } from "./gameParams.js"

export class ScoreManager extends Observer {
	constructor() {
		super()
		this.score = 0
	}

	lineClear(state) {
		const linesCleared = state.linesCleared
		const combo = state.combo
		const level = state.level

		if (linesCleared <= 0) {
			return
		}
		this.score += ScoreTable[linesCleared] * level
		this.score += combo * ScoreTable["COMBO"] * level
	}

	dropPiece(dropType, state) {
		const pieceRow = state.pieceRow
		const dropPieceRow = state.dropRow
		this.score += ScoreTable[dropType] * (pieceRow - dropPieceRow)
	}

	update(state, event) {
		switch (event) {
			case "SOFT_DROP":
			case "HARD_DROP":
				this.dropPiece(event, state)
				break
			case "LINE_CLEAR":
				this.lineClear(state)
				break
		}
	}

	toObject() {
		return {
			score: this.score
		}
	}
}
