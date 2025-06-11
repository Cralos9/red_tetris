import { Bag } from "../Bag.js"
import { getKicks, getRotations } from "../utils.js"
import { Icoor, JLTSZoffsets, Ioffsets, Tcoor } from "../gameParams.js"

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
	const O = Ioffsets[0]
	const R = Ioffsets[1]

	const arr = getRotations(Icoor[0])
	console.log("IRrot:", arr)
//	const kicks = getKicks(O, R)
//	console.log("Kicks:", kicks)
}

offsets()

