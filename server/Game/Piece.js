import { getRotations, getSkirt, compare, getKicks } from "./utils.js"
import {
	Icoor,
	Tcoor,
	Jcoor,
	Lcoor,
	Ocoor,
	Scoor,
	Zcoor,
	JLTSZoffsets,
	Ioffsets,
	Ooffsets
} from "./gameParams.js"

class Piece {
	constructor(coor, offset, color) {
		this.pattern = coor
		this.skirt = getSkirt(coor)
		this.offset = offset
		this.color = color
		this.next = null
		this.before = null
	}

	nextRotation(rot) {
		if (rot === -1) {
			return (this.before)
		}
		return (this.next)
	}

	getPattern() {return (this.pattern)}

	getSkirt() {return (this.skirt)}

	toObject() {
		return {
			pattern: this.pattern,
			color: this.color
		}
	}
}

function createPiece(coor, offsets, color) {
	const root = new Piece(coor, offsets[0], color)
	let prevPiece = root
	let currPiece = root
	for (let i = 1; i < 4; i++) {
		const coor = getRotations(currPiece.pattern).sort(compare)
		const newPiece = new Piece(coor, offsets[i], color)
		currPiece.next = newPiece
		currPiece.before = prevPiece
		prevPiece = currPiece
		currPiece = newPiece
	}
	currPiece.before = prevPiece
	currPiece.next = root
	root.before = currPiece
	return (root)
}

export const Pieces = {
	"I": createPiece(Icoor, Ioffsets, 1),
	"T": createPiece(Tcoor, JLTSZoffsets, 2),
	"J": createPiece(Jcoor, JLTSZoffsets, 3),
	"L": createPiece(Lcoor, JLTSZoffsets, 4),
	"O": createPiece(Ocoor, Ooffsets, 5),
	"S": createPiece(Scoor, JLTSZoffsets, 6),
	"Z": createPiece(Zcoor, JLTSZoffsets, 7),
}

