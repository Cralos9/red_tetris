import Stack from "./Stack.js"
import { expect, jest } from "@jest/globals"

describe('Stack Tests', () => {
	let stack

	beforeEach(() => {
		stack = new Stack()
	})

	it('Top function', () => {
		const nbr1 = 1
		stack.push(nbr1)
		const out1 = stack.top()
		expect(out1).toEqual(nbr1)
		const nbr2 = 2
		stack.push(nbr2)
		const out2 = stack.top()
		expect(out2).toEqual(nbr1)
	})

	it('Pop function', () => {
		const nbr1 = 1
		stack.push(nbr1)
		const out = stack.pop()
		const stackArr = stack.getArr()
		expect(out).toEqual(nbr1)
		expect(stackArr).toHaveLength(0)
		expect(stackArr).toStrictEqual([])
	})

	it('Size function', () => {
		stack.push(3)
		stack.push(3)
		stack.push(3)
		const out = stack.size()
		expect(out).toEqual(3)
	})

	it('Iteration function', () => {
		const mockCallback = jest.fn(x => x + 2)
		stack.push(1)
		stack.push(2)
		stack.push(3)
		const stackSize = stack.size()
		stack.iteration(mockCallback)
		expect(mockCallback.mock.calls).toHaveLength(stackSize)
	})

	it('Empty function', () => {
		const out1 = stack.empty()
		expect(out1).toEqual(true)
		stack.push(3)
		const out2 = stack.empty()
		expect(out2).toEqual(false)
	})
})
