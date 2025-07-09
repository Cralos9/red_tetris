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

		this.paint(pattern, Piece.getColumn(), Piece,getRow(), Piece.getColor())
	}
}
