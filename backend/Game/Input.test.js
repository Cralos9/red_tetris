import Keyboard from "./Input.js"
import { jest } from "@jest/globals"

const key = 'x'

describe('Keyboard Tests', () => {
	let keyboard

	beforeEach(() => {
		keyboard = new Keyboard()
	})

	it('Simulate key press', () => {
		const outRet = keyboard.setPress(key, 100)
		expect(outRet).toEqual(1)
		const outInput = keyboard.isPressed([key])
		expect(outInput).toEqual(true)
	})

	it('Simulate key release', () => {
		const outRet = keyboard.setRelease(key, 100)
		expect(outRet).toEqual(1)
		const outInput = keyboard.isPressed([key])
		expect(outInput).toEqual(false)
	})

	it('IsTap function', () => {
		keyboard.setPress(key, 100)
		const out1 = keyboard.isTap([key], 100)
		expect(out1).toEqual(true)

		const out2 = keyboard.isTap([key], 101)
		expect(out2).toEqual(false)
	})

	it('Reset function', () => {
		const input = keyboard.keys.get(key)
		const spy = jest.spyOn(input, 'reset')
		keyboard.setPress(key, 100)
		keyboard.reset()
		expect(spy).toHaveBeenCalled()
		expect(input.pressed).toEqual(false)
		expect(input.heldTime).toEqual(0)
	})
})
