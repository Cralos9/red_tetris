import Bag from "./Bag.js"
import Piece from "./Piece.js"
import { jest } from "@jest/globals"

describe('Bag Tests', () => {
	let bag

	beforeEach(() => {
		bag = new Bag(1)
	})

	it('GetNextPiece function', () => {
		let bagStack, nextPiece
		const spy = jest.spyOn(bag, 'getRandomOrder')

		for (let i = 0; i < 7; i++) {
			spy.mockClear()
			bagStack = bag.getStack()
			nextPiece = bag.getNextPiece()
			expect(nextPiece).toBeInstanceOf(Piece)
			expect(spy.mock.calls).toHaveLength(0)
			expect(bagStack.size()).toEqual(7)
		}
		spy.mockClear()
		bagStack = bag.getStack()
		nextPiece = bag.getNextPiece()
		expect(nextPiece).toBeInstanceOf(Piece)
		expect(spy.mock.calls).toHaveLength(1)
		expect(bagStack.size()).toEqual(7)
	})

	it('NextPieces to Object', () => {
		const nextPiecesArr = bag.nextPiecesArr()
		expect(nextPiecesArr).toBeInstanceOf(Array)
		nextPiecesArr.forEach((piece) => {
			expect(piece).toBeInstanceOf(Object)
		})
	})
})
