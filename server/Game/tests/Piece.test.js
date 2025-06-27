import { getKicks } from "../utils.js"
import { Pieces } from "../Piece.js"

let piece = Pieces["T"]

test("Piece Rotation", () => {
	for (let i = 0; i < 3; i++) {
		const data = piece.nextRotation()
		expect(data.before).toBe(piece)
	}
})
