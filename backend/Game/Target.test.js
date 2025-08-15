import EventDispatcher from "../Utils/EventDispatcher.js"
import { GARBAGE_DELAY } from "./gameParams.js"
import { Player } from "../Player.js"
import { TargetManager } from "./Target.js"
import { expect, jest } from "@jest/globals"

const targets = [
	new Player("J", null, null, "1"),
	new Player("L", null, null, "2"),
	new Player("I", null, null, "3"),
]

describe('TargetManager Tests', () => {
	let targetManager, garbageCb

	beforeEach(() => {
		garbageCb = jest.fn()
		const eventManager = new EventDispatcher()

		targets.forEach(target => {
			const eventManager = new EventDispatcher()
			target.targetManager = new TargetManager(garbageCb, eventManager, null)
		})
		targetManager = new TargetManager(garbageCb, eventManager, targets)
	})
	it('Cancel 0 Lines of Garbage', () => {
		const linesCleared = 4
		const out = targetManager.cancelGarbage(linesCleared)
		expect(out).toEqual(linesCleared)
	})

	it('Cancel >0 Lines of Garbage', () => {
		const garbageStack = targetManager.getGarbageStack()
		const linesCleared = 4
		const garbageLines = 4

		garbageStack.push({lines: garbageLines, timer: Date.now()})
		const out = targetManager.cancelGarbage(linesCleared)
		expect(out).toEqual(linesCleared - garbageLines)
		expect(garbageStack.empty()).toEqual(true)

	})

	it('Cancel with less lines cleared than garbage', () => {
		const garbageStack = targetManager.getGarbageStack()
		const linesCleared = 2
		const garbageLines = 4

		garbageStack.push({lines: garbageLines, timer: Date.now()})
		const outCancel = targetManager.cancelGarbage(linesCleared)
		const outTopGarbage = garbageStack.top()
		expect(outCancel).toEqual(0)
		expect(outTopGarbage.lines).toEqual(garbageLines - linesCleared)
	})

	it('Cancel with more lines cleared than garbage', () => {
		const garbageStack = targetManager.getGarbageStack()
		const linesCleared = 10
		const garbageLines = 3

		garbageStack.push({lines: garbageLines, timer: Date.now()})
		garbageStack.push({lines: garbageLines, timer: Date.now()})
		const out = targetManager.cancelGarbage(linesCleared)
		const exp = linesCleared - (garbageLines * 2)
		expect(out).toEqual(exp)
		expect(garbageStack.empty()).toEqual(true)
	})

	it('Send and Receive Garbage', () => {
		const linesCleared = 4
		const state = {
			linesCleared: linesCleared,
			combo: 1
		}
		const spy = jest.spyOn(targetManager, 'cancelGarbage').mockImplementation(() => linesCleared)
		targetManager.sendGarbage(state)
		expect(spy.mock.calls).toHaveLength(1)
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
		const state = {
			linesCleared: 0
		}
		const gbStack = targetManager.getGarbageStack()
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		targetManager.receiveGarbage(state)
		expect(garbageCb.mock.calls).toHaveLength(2)
	})

	it('Receive Garbage in a Line Clear', () => {
		const state = {
			linesCleared: 1
		}
		const gbStack = targetManager.getGarbageStack()
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		gbStack.push({lines: 4, timer: GARBAGE_DELAY})
		targetManager.receiveGarbage(state)
		expect(garbageCb.mock.calls).toHaveLength(0)
	})
})
