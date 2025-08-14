export class Stack {
	constructor() {
		// This is a FIFO stack
		this.arr = []
	}

	push(element) { this.arr.push(element) }

	pop() { return (this.arr.shift()) }

	top() { return (this.arr[0]) }

	iteration(callback) { this.arr.forEach(callback) }

	empty() {
		if (this.arr.length !== 0) {
			return (false)
		}
		return (true)
	}

	size() { return (this.arr.length) }

	getArr() { return (this.arr) }

	printStack() { console.log("Stack:", this.arr) }
}
