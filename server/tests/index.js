import { Bag } from "../Bag.js"
import { getKicks } from "../utils.js"
import { commonOffsets } from "../gameParams.js"

const bag = new Bag()

function printStack(stack) {
	let out = ""
	for (let i = 0; i < stack.length; i++) {
		out += stack[i].toString() + " "
	}
	console.log(out)
}

function bagTests() {
	printStack(bag.getStack())
	console.log("Get Next Piece")
	for (let i = 0; i < 8; i++) {
		bag.getNextPiece()
	}
	printStack(bag.getStack())
}

function offsets() {
	const O = commonOffsets[0]
	const R = commonOffsets[1]
	const kicks = getKicks(O, R)
	console.log("Kicks:", kicks)
}

offsets()

