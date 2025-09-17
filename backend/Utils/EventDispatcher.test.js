import EventDispatcher from "./EventDispatcher.js";
import { expect, jest } from "@jest/globals"

const event = "TEST"
const mockCallback1 = jest.fn((state) => { console.log("Callback1", state) })
const mockCallback2 = jest.fn((state) => { console.log("Callback2", state) })

describe("EventDispatcher Tests", () => {
	let engine = new EventDispatcher()

	beforeEach(() => {
		engine = new EventDispatcher()
	})

	it('Fire a notify for an event without callbacks', () => {
		const out = engine.notify({mock:true}, "LOL")
		expect(out).toEqual(0)
	})

	it('Subscribe and notify an event', () => {
		const outSubscribe = engine.subscribe(event, mockCallback1)
		const outNotify = engine.notify({mock: true}, event)
		expect(mockCallback1.mock.calls).toHaveLength(1)
		expect(outSubscribe).toEqual(1)
		expect(outNotify).toEqual(1)
	})

	it('Subscribe with the same callback', () => {
		const out1 = engine.subscribe(event, mockCallback1)
		const out2 = engine.subscribe(event, mockCallback1)
		expect(out1).toEqual(1)
		expect(out2).toEqual(0)
	})

	it('Subscribe with two different callbacks', () => {
		const out1 = engine.subscribe(event, mockCallback1)
		const out2 = engine.subscribe(event, mockCallback2)
		expect(out1).toEqual(1)
		expect(out2).toEqual(1)
		const outNotify = engine.notify({mock:true}, event)
		expect(outNotify).toEqual(1)
	})
})
