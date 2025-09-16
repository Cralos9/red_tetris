import EventDispatcher from "../Utils/EventDispatcher.js"
import { GARBAGE_DELAY } from "./gameParams.js"
import { garbageCalculationTetris } from "./Strategy/GarbageCalculation.js"
import TargetManager from "./Target.js"
import { expect, jest } from "@jest/globals"

jest.unstable_mockModule('./GameController.js', () => ({
	default: jest.fn(),
}))

const Player = (await import('../Player.js')).default

describe('TargetManager Tests', () => {
	let targetManager, garbageCb, targets, gbCalc
	const combo = 1
	const pieceSpin = false

	beforeEach(() => {
		targets = [
			new Player("J", null, null, "1"),
			new Player("L", null, null, "2"),
			new Player("I", null, null, "3"),
		]
		garbageCb = jest.fn()
		const eventManager = new EventDispatcher()

		targets.forEach(target => {
			const eventManager = new EventDispatcher()
			target.targetManager = new TargetManager(garbageCb, eventManager, null)
		})
		gbCalc = garbageCalculationTetris
		targetManager = new TargetManager(
			garbageCb,
			eventManager,
			targets,
			gbCalc
		)
	})

	describe('Garbage Calculation', () => {
		let garbageStack

		beforeEach(() => {
			garbageStack = targetManager.getGarbageStack()
		})

		it('Without Cancel', () => {
			const linesCleared = 4
			const out = gbCalc.execute(targetManager, linesCleared, combo, pieceSpin)
			const exp = linesCleared - 1
			expect(out).toEqual(exp)
		})

		it('Cancel >0 Lines of Garbage', () => {
			const linesCleared = 4
			const garbageLines = 4

			garbageStack.push({lines: garbageLines, timer: Date.now()})
			const out = gbCalc.execute(targetManager, linesCleared, combo, pieceSpin)
			const exp = linesCleared - garbageLines - 1
			expect(out).toEqual(exp)
			expect(garbageStack.empty()).toEqual(true)
		})

		it('Cancel with less lines cleared than garbage', () => {
			const linesCleared = 2
			const garbageLines = 4

			garbageStack.push({lines: garbageLines, timer: Date.now()})
			const outCancel = gbCalc.execute(targetManager, linesCleared, combo, pieceSpin)
			const outTopGarbage = garbageStack.top()
			expect(outCancel).toEqual(-1)
			expect(outTopGarbage.lines).toEqual(garbageLines - linesCleared)
		})

		it('Cancel with more lines cleared than garbage', () => {
			const linesCleared = 10
			const garbageLines = 3

			garbageStack.push({lines: garbageLines, timer: Date.now()})
			garbageStack.push({lines: garbageLines, timer: Date.now()})
			const out = gbCalc.execute(targetManager, linesCleared, combo, pieceSpin)
			const exp = linesCleared - (garbageLines * 2) - 1
			expect(out).toEqual(exp)
			expect(garbageStack.empty()).toEqual(true)
		})
	})

	const state = {
		linesCleared: 0,
		level: 1,
		combo: 1
	}

	it('Send and Receive Garbage', () => {
		const linesCleared = 4
		state.linesCleared = linesCleared
		targetManager.sendGarbage(state)
		const tmTargets = targetManager.getTargets()
		expect(tmTargets).toHaveLength(targets.length)
		tmTargets.forEach(target => {
			const tm = target.getTargetManager()
			const garbage = tm.getGarbageStack().top()
			expect(garbage.lines).toBeGreaterThanOrEqual(linesCleared - 1)
			tm.receiveGarbage({linesCleared: 0})
			expect(garbageCb.mock.calls).toHaveLength(0)
		})
	})

	it('Receive Garbage', () => {
		state.linesCleared = 0
		const gbStack = targetManager.getGarbageStack()
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		targetManager.receiveGarbage(state)
		expect(garbageCb.mock.calls).toHaveLength(2)
	})

	it('Stall incoming Garbage with a Line Clear', () => {
		state.linesCleared = 1
		const gbStack = targetManager.getGarbageStack()
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		targetManager.receiveGarbage(state)
		expect(garbageCb.mock.calls).toHaveLength(0)
	})
})
