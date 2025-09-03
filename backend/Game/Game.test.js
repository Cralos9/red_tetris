import Game from "./Game.js"
import { ROWS, COLUMNS } from "./gameParams.js"
import { expect, jest } from "@jest/globals"
import { CreateGarbageTetris } from "./Strategy/CreateGarbage.js"
import { PatternMatchTetris } from "./Strategy/PatternMatch.js"

jest.unstable_mockModule('../Utils/EventDispatcher.js', () => ({
	default: jest.fn()
}))

jest.unstable_mockModule('./GameController.js', () => ({
	default: jest.fn().mockImplementation(() => ({
		keyStates: jest.fn()
	}))
}))

const EventDispatcher = (await import('../Utils/EventDispatcher.js')).default
const GameController = (await import('./GameController.js')).default
const seed = 120

const createField = (toFill) => {
	const arr = Array(ROWS)
	for (let i = 0; i < ROWS; i++) {
		arr[i] = Array(COLUMNS).fill(toFill)
	}
	return (arr)
}

const fillLines = (arr, end) => {
	for (let i = ROWS - 1; i >= end; i--) {
		arr[i].fill(1)
	}
}

describe('Game Tests', () => {
	let game

	beforeEach(() => {
		EventDispatcher.mockClear()
		GameController.mockClear()
		const eventManager = new EventDispatcher()
		const gameCtrl = new GameController()
		game = new Game(
			gameCtrl,
			eventManager,
			seed,
			new CreateGarbageTetris(),
			new PatternMatchTetris()
		)
	})

	describe('ChangeLevel', () => {
		it('1 level', () => {
			game.changeLevel(1)
			expect(game.getLevel()).toEqual(1)
		})

		it('1 to 10 Level', () => {
			for (let i = 1; i <= 10; i++) {
				game.changeLevel(i)
				expect(game.getLevel()).toEqual(i)
			}
		})
	})

	describe("Field Tests", () => {
		it("Field Creation", () => {
			const outField = game.field
			const expFieldLen = ROWS
			expect(outField).toHaveLength(expFieldLen)
			for (let i = 0; i < ROWS; i++) {
				const outFieldColumn = game.field[i]
				const expFieldColumnLen = COLUMNS
				expect(outFieldColumn).toHaveLength(expFieldColumnLen)
			}
		})

		describe('ReplaceLine', () => {
			it('Replace a completed line with an empty line (1 -> 0)', () => {
				const startRow = Math.floor(ROWS / 2)
				for (let i = startRow; i < ROWS ; i++) {
					game.field[i].fill(1)
				}
				game.replaceLine(startRow, 0)
				const expArr = [0]
				expect(game.field[startRow]).toEqual(expect.arrayContaining(expArr))
			})
			
			it('Replace an empty line with a completed line (0 -> 1)', () => {
				const startRow = 0
				const replacedLine = ROWS - 1
				game.field[startRow].fill(1)
				game.replaceLine(replacedLine, startRow)
				const expArr = [1]
				expect(game.field[replacedLine]).toEqual(expect.arrayContaining(expArr))
				
			})
		})
	})

	describe("Hold Tests", () => {
		let spyReset

		beforeEach(() => {
			spyReset = jest.spyOn(game, 'resetPiece')
		})

		it("Empty Hold", () => {
			const currPiece = game.Piece
			const spyPieceReset = jest.spyOn(currPiece, 'reset')
			game.holdPiece()
			const holdPiece = game.hold
			expect(currPiece).toEqual(holdPiece)
			expect(spyPieceReset.mock.calls).toHaveLength(1)
			expect(spyReset.mock.calls).toHaveLength(1)
		})

		it("Switch with Holded Piece", () => {
			game.holdPiece()
			const oldCurrPiece = game.Piece
			const oldHold = game.hold
			game.holdPiece()
			const currHold = game.hold
			const currPiece = game.Piece
			expect(currPiece).toEqual(oldHold)
			expect(currHold).toEqual(oldCurrPiece)
		})
	})

	describe("Pattern Match Tests", () => {
		for (let i = 0; i < 4; i++) {
			it(`${i} Lines`, () => {
				const endLine = ROWS - i
				const arr = Array(i)
				for (let k = 0; k < i; k++) { arr[k] = (ROWS - 1) - k }
				fillLines(game.field, endLine)
				game.patternMatch()
				const expStackHeight = endLine
				expect(game.stackHeight).toEqual(expStackHeight)
				expect(game.hitList).toStrictEqual(arr)
			})
		}
	})

	describe("Create Garbage Tests", () => {
		const expGarbageLineContains = [0,8]

		for (let i = 0; i <= ROWS + 1; i++) {
			it(`${i} Lines`, () => {
				game.createGarbage(i)
				const gap = game.field[ROWS - 1].find(cell => cell === 0)
				for (let k = 1; k < ROWS && k <= i; k++) {
					const garbage = game.field[ROWS - k]
					const outGap = garbage.find(cell => cell === 0)
					expect(outGap).toEqual(gap)
					expect(garbage).toHaveLength(COLUMNS)
					expect(garbage).toEqual(
						expect.arrayContaining(expGarbageLineContains)
					)
				}
			})
		}

		it('Creating Garbage without an empty field', () => {
			const nbrGarbageLines = 4
			const nbrFilledLines = 3
			const expFilledLines = [1]
			fillLines(game.field, ROWS - nbrFilledLines)
			game.stackHeight = ROWS - nbrFilledLines
			game.createGarbage(nbrGarbageLines)
			for (let i = 0; i < nbrFilledLines; i++) {
				const index = (ROWS - 1) - nbrGarbageLines - i
				expect(game.field[index]).toEqual(
					expect.arrayContaining(expFilledLines)
				)
			}
		})
	})

	describe('Line Clear Tests', () => {
		for (let lines = 0; lines < ROWS; lines++) {
			it(`${lines} Lines`, () => {
				const lineHeight = ROWS - lines
				fillLines(game.field, lineHeight)
				game.patternMatch()
				game.lineClear()
				const expField = createField(0)
				expect(game.field).toStrictEqual(expField)
				expect(game.linesCleared).toEqual(lines)
				expect(game.stackHeight).toEqual(ROWS)
				expect(game.combo).toEqual(lines ? 1 : 0)
			})
		}
	})

	it('Lose Condition', () => {
		game.createGarbage(ROWS)
		expect(game.stackHeight).toEqual(0)
		game.update()
		expect(game.running).toEqual(false)
	})
})
