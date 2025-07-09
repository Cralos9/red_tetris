import { Game } from "./Game.js"
import { ROWS, COLUMNS } from "./gameParams.js"

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

describe("HardDrop Tests", () => {
	const game = new Game()

	test("HardDrop to the floor (19x)", () => {
		const floorCoor = ROWS - 1
		game.hardDrop()
		const outPieceRow = game.Piece.row
		const expPieceRow = floorCoor
		expect(outPieceRow).toEqual(expPieceRow)
	})
})

describe("Hold Tests", () => {
	const game = new Game()

	test("Empty Hold", () => {
		const currPiece = game.Piece
		game.holdPiece()
		const holdPiece = game.hold
		expect(currPiece).toEqual(holdPiece)
	})

	test("Switch with Holded Piece", () => {
		const futureHold = game.Piece
		const futureCurrPiece = game.hold
		game.holdPiece()
		const holdPiece = game.hold
		const currPiece = game.Piece
		expect(currPiece).toEqual(futureCurrPiece)
		expect(holdPiece).toEqual(futureHold)
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

	test('0 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	test('1 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 1
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	test('2 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 2
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	test('3 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 3
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
	test('4 Lines', () => {
		testMarkedLines()
		const expStackHeight = ROWS - 4
		const outStackHeight = game.stackHeight
		expect(outStackHeight).toBe(expStackHeight)
	})
})

describe("Create Garbage Tests", () => {
	const game = new Game()
	const expGarbageLineContains = [0,8]

	test('1 Lines', () => {
		game.garbageQueue.push(1)
		game.createGarbage()
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

		test('1 Line', () => { testFullClears(lineNbr) })
		test('2 Line', () => { testFullClears(lineNbr) })
		test('3 Line', () => { testFullClears(lineNbr) })
		test('4 Line', () => { testFullClears(lineNbr) })
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

		test("4 Lines", () => {
			const line = ROWS - 1
			const outFieldLeft = game.field[line]
			const expFieldLeft = Array(COLUMNS).fill(1)
			expFieldLeft[gap] = 0
			expect(outFieldLeft).toStrictEqual(expFieldLeft)
		})
	})
})
