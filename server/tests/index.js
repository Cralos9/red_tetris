import { Bag } from "../Bag.js"

const bag = new Bag()

function printStack(stack) {
	let out = ""
	for (let i = 0; i < stack.length; i++) {
		out += stack[i].toString() + " "
	}
	console.log(out)
}

printStack(bag.getStack())
console.log("Get Next Piece")
for (let i = 0; i < 8; i++) {
	bag.getNextPiece()
}
printStack(bag.getStack())
