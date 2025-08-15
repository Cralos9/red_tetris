import { ScoreManager } from "./Score.js"
import EventDispatcher from "../Utils/EventDispatcher.js"
import { jest } from "@jest/globals"
import { GAME_EVENTS } from "./gameParams.js"

jest.mock("../Utils/EventDispatcher.js")

describe('Score Tests', () => {
	let score

	beforeEach(() => {
		const eventManager = new EventDispatcher()
		score = new ScoreManager(eventManager)
	})

	it('Drop Piece Score', () => {
		const state = {
			dropRow: 9,
			pieceRow: 10,
			dropType: GAME_EVENTS.SOFT_DROP
		}
		score.dropPiece(state)
		const out1 = score.getScore()
		expect(out1).toBeGreaterThan(0)

		score.dropPiece(state)
		const out2 = score.getScore()
		expect(out2).toBeGreaterThan(out1)
	})

	it('0 Line Clear Score', () => {
		const state = {
			linesCleared: 0,
			combo: 0,
			level: 1,
			spin: false
		}

		score.lineClear(state)
		const out = score.getScore()
		expect(out).toEqual(0)
	})

	it('>0 Line Clear Score', () => {
		const state = {
			linesCleared: 4,
			combo: 1,
			level: 1,
			spin: false
		}
		score.lineClear(state)
		const out1 = score.getScore()
		expect(out1).toBeGreaterThan(0)

		score.lineClear(state)
		const out2 = score.getScore()
		expect(out2).toBeGreaterThan(out1)
	})

	it('Spin Score', () => {
		const state = {
			linesCleared: 4,
			combo: 1,
			level: 1,
			spin: true
		}
		score.lineClear(state)
		const out1 = score.getScore()
		expect(out1).toBeGreaterThan(0)

		score.lineClear(state)
		const out2 = score.getScore()
		expect(out2).toBeGreaterThan(out1)
	})
})
