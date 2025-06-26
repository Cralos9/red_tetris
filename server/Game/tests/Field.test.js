import { Field } from "../Field.js"
import { Piece } from "../Piece.js"
import { Tcoor, JLTSZoffsets, COLUMNS, ROWS } from "../gameParams.js"


describe("CheckMove Function", () => {
	const field = new Field()
	const piece = new Piece(Tcoor, JLTSZoffsets, 1)
	
	test("Valid Move", () => {
		const data = field.checkMove(piece, 0, 1)
		expect(data).toEqual(true)
	})

	test("Invalid Move", () => {
		piece.column = COLUMNS - 1
		const data = field.checkMove(piece, 0, 1)
		expect(data).toEqual(false)
	})
})

describe("PatternMatch and LineClear Functions", () => {
	const field = new Field()
	const line = ROWS - 1
	
	test("Empty Board", () => {
		field.patternMatch()
		expect(field.hitArr.length).toEqual(0)
	})

	test("One Line", () => {
		field.field[line].fill(1)
		field.patternMatch()
		expect(field.hitArr.length).toEqual(1)
		expect(field.hitArr[0]).toEqual(line)
		expect(field.stackHeight).toEqual(line)
	})

	test("Clear One Line", () => {
		field.lineClears()
		expect(field.hitArr.length).toEqual(0)
		expect(field.field[line]).toEqual(Array(COLUMNS).fill(0))
		expect(field.linesCleared).toEqual(1)
	})
})
