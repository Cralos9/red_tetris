import { Piece } from "./models.js"
import { randomNbr } from "./utils.js"

var field = []

const pieces = new Map()

pieces.set("I", new Piece(1, 4, "I"))
pieces.set("T", new Piece(2, 3, "T"))
pieces.set("O", new Piece(2, 2, "O"))
pieces.set("J", new Piece(2, 3, "J"))
pieces.set("L", new Piece(2, 3, "L"))
pieces.set("S", new Piece(2, 4, "S"))
pieces.set("Z", new Piece(2, 4, "Z"))

const MAX_COLUMN = 10
const MAX_ROWS = 20

var currColumn = 5
var currRow = 20

function tetrisBag(pieces) {
	console.log(pieces.size)
	const nbr = randomNbr(pieces.size)
	console.log(nbr)
}

export function startGame() {
	console.log(currColumn)
	tetrisBag(pieces)
}
