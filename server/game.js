import { Piece } from "./models.js"
import { randomNbr } from "./utils.js"

var field = []

const pieces = [
	new Piece(1, 4, "I"),
	new Piece(2, 3, "T"),
	new Piece(2, 2, "O"),
	new Piece(2, 3, "J"),
	new Piece(2, 3, "L"),
	new Piece(2, 4, "S"),
	new Piece(2, 4, "Z"),
]

const MAX_COLUMN = 10
const MAX_ROWS = 20

var currColumn = 5
var currRow = 20

function tetrisBag(pieces) {
	
	for (let i = pieces.length - 1; i > 0 ; i--) {
		const nbr = randomNbr(i)
		if (i === nbr) {
			continue
		}
		const tmp = pieces[i]
		pieces[i] = pieces[nbr]
		pieces[nbr] = tmp
	}
	pieces.forEach(element => {
		console.log(element)
	});
}

export function startGame() {
	//tetrisBag(pieces)
}
