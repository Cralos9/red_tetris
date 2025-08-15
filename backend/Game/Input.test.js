import { Keyboard } from "./Input.js"
import { jest } from "@jest/globals"

const key = 'x'

describe('Keyboard Tests', () => {
	let keyboard

	beforeEach(() => {
		keyboard = new Keyboard()
	})

	it('Simulate key press', () => {
		const outRet = keyboard.set(key, true)
		expect(outRet).toEqual(1)
		const outInput = keyboard.isPressed([key])
		expect(outInput).toEqual(true)
	})

	it('Simulate key release', () => {
		const outRet = keyboard.set(key, false)
		expect(outRet).toEqual(1)
		const outInput = keyboard.isPressed([key])
		expect(outInput).toEqual(false)
	})

	it('IsTap function', () => {
		keyboard.set(key, true)
		keyboard.update()
		const out1 = keyboard.isTap([key])
		expect(out1).toEqual(true)

		keyboard.update()
		const out2 = keyboard.isTap([key])
		expect(out2).toEqual(false)
	})

	it('Reset function', () => {
		const input = keyboard.keys[key]
		const spy = jest.spyOn(input, 'reset')
		keyboard.set(key, true)
		keyboard.reset()
		expect(spy).toHaveBeenCalled()
		expect(input.pressed).toEqual(false)
		expect(input.tap).toEqual(false)
		expect(input.heldTimer).toEqual(0)
	})
})
