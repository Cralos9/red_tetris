import { Colors } from "./gameParams.js"

export class Field {
	constructor() {
		this.field = Array(ROWS)

		for (let i = 0; i < ROWS; i++) {
			this.field[i] = Array(COLUMNS).fill(0)
		}
	}

	paint(pattern, Px, Py, color) {
		pattern.forEach(point => {
			const x = Px + point[0]
			const y = Py + point[1]
			this.field[y][x] = color
		})
	}
	
	update(Piece) {
		const pattern = Piece.getCurrPattern()
		var ghostY = 0

		while (this.checkCollision(Piece) === false) {
			ghostY += 1
		}

		this.paint(pattern, Piece.getColumn(), Piece.getRow() + ghostY, Colors.GHOST)
		this.paint(pattern, Piece.getColumn(), Piece.getRow(), Piece.getColor())
	}

	checkCollision(Piece) {
		const skirt = Piece.getCurrSkirt()
		const Px = Piece.getColumn()
		const Py = Piece.getRow()

		for (let i = 0; i < skirt.length; i++) {
			const x = Px + skirt[i][0]
			const y = Py + skirt[i][1] + 1
			if (y === ROWS || y > -1 && this.field[y][x] > 0) {
				return (true)
			}
		}
		return (false)
	}
}
