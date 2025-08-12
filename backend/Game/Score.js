import { ScoreTable, GAME_EVENTS } from "./gameParams.js"

export class ScoreManager {
	constructor(eventManager) {
		this.score = 0
		eventManager.subscribe(GAME_EVENTS.LINE_CLEAR, this.lineClear.bind(this))
		eventManager.subscribe(GAME_EVENTS.HARD_DROP, this.dropPiece.bind(this))
		eventManager.subscribe(GAME_EVENTS.SOFT_DROP, this.dropPiece.bind(this))
	}

	lineClear(state) {
		const linesCleared = state.linesCleared
		const combo = state.combo
		const level = state.level
		const pieceSpin = state.spin

		var lineClearScore = ScoreTable[linesCleared] * level
		const comboScore = combo * ScoreTable["COMBO"] * level
		var score = lineClearScore + comboScore

		if (pieceSpin === true) {
			score *= ScoreTable["SPIN"]
		}
		this.score += score
	}

	dropPiece(state) {
		const pieceRow = state.pieceRow
		const dropPieceRow = state.dropRow
		const dropType = state.dropType
		this.score += ScoreTable[dropType] * (pieceRow - dropPieceRow)
	}

	toObject() {
		return {
			score: this.score
		}
	}
}
