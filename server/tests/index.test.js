import { Bag } from "../Bag.js"
import { getKicks, getRotations } from "../utils.js"
import { Icoor, JLTSZoffsets, Ioffsets, Tcoor } from "../gameParams.js"
import { Game } from "../Game.js"
import { COLUMNS, ROWS } from "../gameParams.js"

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

function completeLines(nbr, field) {
	for (let i = 0; i < nbr; i++) {
		for (let k = 0; k < COLUMNS; k++) {
			field[(ROWS - 1) - i][k] = 1
		}
	}
}


describe("PatternMatching (Mark Lines for Clear)", () => {
	const game = new Game()
	let nbrLines = 0
	let data = game.hitList

	beforeEach(() => {
		completeLines(nbrLines, game.field)
		game.patternMatch()
		data = game.hitList
	})

	afterEach(() => {
		game.hitList = []
	})

	test('Zero Lines Marked', () => {
		expect(data.length).toEqual(nbrLines)
	})
	nbrLines = 1
	test('One Line Marked', () => {
		expect(data.length).toEqual(nbrLines)
	})
	nbrLines = 2
	test('Two Line Marked', () => {
		expect(data.length).toEqual(nbrLines)
	})
	nbrLines = 3
	test('Two Line Marked', () => {
		expect(data.length).toEqual(nbrLines)
	})
	nbrLines = 4
	test('Two Line Marked', () => {
		expect(data.length).toEqual(nbrLines)
	})
})

import { Room } from "../Room.js"
import { Player } from "../Player.js"

describe('Join and Leave Rooms', () => {
	const room = new Room()
	const player1 = new Player("LOl1", null, 123)
	const player2 = new Player("LOl2", null, 124)
	const player3 = new Player("Lol3", null, 125)

	room.addPlayer(player1.id, player1)
	room.addPlayer(player2.id, player2)
	room.addPlayer(player3.id, player3)
	test('Targets', () => {
		room.leavePlayer(124)
		expect(player1.targets.length).toEqual(1)
	})
})

test('Reset Coordinates in the matrix after collision', () => {
	const piece = bag.getNextPiece()
	const data = [piece.row, piece.column, piece.index]
	expect(data).toEqual([1, 5, 0])
})
