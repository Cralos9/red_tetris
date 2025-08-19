import Game from "./Game.js"
import { ROWS, COLUMNS } from "./gameParams.js"
import { jest } from "@jest/globals"

describe('Game Tests', () => {
	let game

	beforeEach(() => {
		game = new Game()
	})

	describe('ChangeLevel', () => {
		it('+1 level', () => {
			game.changeLevel()
			expect(game.getLevel()).toEqual(2)
		})

		it('Max level', () => {
			for (let i = 1; i <= 10; i++) {
				expect(game.getLevel()).toEqual(i)
				game.changeLevel()
			}
			game.changeLevel()
			expect(game.getLevel()).toEqual(10)
		})
	})
})

describe("Field Tests", () => {
	const game = new Game()

	test("Field Creation", () => {
		const outField = game.field
		const expFieldLen = ROWS
		expect(outField).toHaveLength(expFieldLen)
		for (let i = 0; i < ROWS; i++) {
			const outFieldColumn = game.field[i]
			const expFieldColumnLen = COLUMNS
			expect(outFieldColumn).toHaveLength(expFieldColumnLen)
		}
	})
})

describe("Hold Tests", () => {
	let game, spyReset

	beforeEach(() => {
		game = new Game()
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
	const game = new Game()
	var fillRow = ROWS - 1

	beforeEach(() => {
		game.patternMatch()
		game.field[fillRow].fill(1)
		fillRow -= 1
	})

	const testMarkedLines = () => {
		var startRow = ROWS - 1
		game.hitList.forEach(outLine => {
			const expLine = startRow
			//console.log("Lines:", expLine, startRow)
			expect(outLine).toBe(expLine)
			startRow -= 1
		})
	}

	it('0 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	it('1 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 1
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	it('2 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 2
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	it('3 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 3
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	it('4 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 4
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
})

describe("Create Garbage Tests", () => {
	const game = new Game()
	const expGarbageLineContains = [0,8]

	it('1 Lines', () => {
		game.createGarbage(1)
		const outGarbageLine = game.field[ROWS - 1]
		const expGarbageLen = COLUMNS
		expect(outGarbageLine).toHaveLength(expGarbageLen)
		expect(outGarbageLine).toEqual(
			expect.arrayContaining(expGarbageLineContains)
		)
	})
})

describe("Line Clear Tests", () => {
	describe("Perfect Clears (Empty Field)", () => {
		const game = new Game()
		var lineNbr = 0
		const emptyField = Array(ROWS)
		for (let i = 0; i < ROWS; i++) {
			emptyField[i] = Array(COLUMNS).fill(0)
		}

		beforeEach(() => {
			lineNbr += 1
			for (let i = 0; i < lineNbr; i++) {
				const line = (ROWS - 1) - i
				game.field[line].fill(1)
			}
			game.patternMatch()
			game.lineClear()
		})

		const testFullClears = (lineNbr) => {
			const outField = game.field
			const expField = emptyField
			expect(outField).toStrictEqual(expField)
			const outLineNbr = game.linesCleared
			const expLineNbr = lineNbr
			expect(outLineNbr).toBe(expLineNbr)
			const outStackHeight = game.stackHeight
			const expStackHeight = ROWS
			expect(outStackHeight).toBe(expStackHeight)
		}

		it('1 Line', () => { testFullClears(lineNbr) })
		it('2 Line', () => { testFullClears(lineNbr) })
		it('3 Line', () => { testFullClears(lineNbr) })
		it('4 Line', () => { testFullClears(lineNbr) })
	})
	describe("Gap Clears", () => {
		const game = new Game()
		const gap = 5
		var linenbr = 6

		beforeEach(() => {
			for (let i = 0; i < linenbr; i++) {
				const line = (ROWS - 1) - i
				game.field[line].fill(1)
			}
			game.field[ROWS - linenbr][gap] = 0
			game.patternMatch()
			game.lineClear()
		})

		it("4 Lines", () => {
			const line = ROWS - 1
			const outFieldLeft = game.field[line]
			const expFieldLeft = Array(COLUMNS).fill(1)
			expFieldLeft[gap] = 0
			expect(outFieldLeft).toStrictEqual(expFieldLeft)
		})
	})
})

