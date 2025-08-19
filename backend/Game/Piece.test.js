import Piece from "./Piece.js"
import Game from "./Game.js"
import { COLORS, Tcoor } from "../../common.js"
import { JLTSZoffsets } from "./gameParams.js"
import { ROWS, COLUMNS, GAME_EVENTS } from "./gameParams.js"
import { expect, jest } from "@jest/globals"

describe('Piece Tests', () => {
	var piece, game

	beforeEach(() => {
		game = new Game(null, null, 1)
		piece = new Piece(Tcoor, JLTSZoffsets, COLORS.PURPLE)
	})

	it('HardDrop', () => {
		piece.hardDrop(game.getField())
		expect(piece.getLock()).toEqual(true)
		expect(piece.getRow()).toEqual(ROWS - 1)
	})

	it('SoftDrop', () => {
		var startRow

		for (let i = 0; i < ROWS - 2; i++) {
			startRow = piece.getRow()
			piece.softDrop(game.getField())
			expect(piece.getCollision()).toEqual(false)
			expect(piece.getRow()).toEqual(startRow + 1)
		}

		for (let i = 0; i < 30; i++) {
			startRow = piece.getRow()
			piece.softDrop(game.getField())
			expect(piece.getCollision()).toEqual(true)
			expect(piece.getRow()).toEqual(startRow)
			expect(piece.getLockDelay()).toBeGreaterThan(0)
			expect(piece.getLock()).toEqual(false)
		}

		piece.softDrop(game.getField())
		expect(piece.getCollision()).toEqual(true)
		expect(piece.getRow()).toEqual(startRow)
		expect(piece.getLockDelay()).toBeGreaterThanOrEqual(30)
		expect(piece.getLock()).toEqual(true)
	})

	it('Piece toObject', () => {
		const pieceObject = piece.toObject()
		expect(pieceObject).toBeInstanceOf(Object)
		expect(pieceObject.color).toBeDefined()
		expect(pieceObject.pattern).toBeDefined()
	})

	describe('Move and Rotations', () => {
		const right = 1
		const left = -1
		let spy

		beforeEach(() => {
			spy = jest.spyOn(piece, 'updateShift')
		})

		it('Move', () => {
			const checkMove = (expColumn, move, spyCalls) => {
				spy.mockClear()
				piece.move(game.getField(), move)
				expect(piece.getColumn()).toEqual(expColumn)
				expect(spy.mock.calls).toHaveLength(spyCalls)
				expect(piece.getLastShift()).toEqual(GAME_EVENTS.MOVE)
			}

			for (let i = 0; i < (COLUMNS / 2) - 2; i++) {
				checkMove(piece.getColumn() + right, right, 1)
			}

			// Right Collision check
			checkMove(piece.getColumn(), right, 0)

			for (let i = 0; i < COLUMNS - 3; i++) {
				checkMove(piece.getColumn() + left, left, 1)
			}

			// Left Collision check
			checkMove(piece.getColumn(), left, 0)
		})

		it('Rotate', () => {
			const incIndex = (index, rot) => {
				return ((index + rot + 4) % 4)
			}
			const checkRot = (expRot, rot, spyCalls) => {
				spy.mockClear()
				piece.rotate(game.getField(), rot)
				expect(piece.getIndex()).toEqual(expRot)
				expect(spy.mock.calls).toHaveLength(spyCalls)
				expect(piece.getLastShift()).toEqual(GAME_EVENTS.ROTATION)
			}

			for (let i = 0; i < 4; i++) {
				checkRot(incIndex(piece.getIndex(), right), right, 1)
			}

			for (let i = 0; i < 4; i++) {
				checkRot(incIndex(piece.getIndex(), left), left, 1)
			}
		})
	})

})
