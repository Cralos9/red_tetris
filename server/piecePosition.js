export function getSkirt(pos) {
	let arr = []
	let lowerY = pos[0][1]
	let pieceX = pos[0][1];

	for (let i = 0; i < pos.length; i++) {
		if (pos[i][0] != pieceX && pos[i][1] != lowerY) {
			arr.push(pos[i])
			lowerY = pos[i][1]
		} else if (pos[i][1] >= lowerY) {
			arr.push(pos[i])
			lowerY = pos[i][1]
		}
		pieceX = pos[i][0]
	}
	return (arr)
}

export const I = [
	[0,0], [1,0], [2,0], [3,0]
]

// const arr[1][3][3]
export const T = [
	[0,0], [1,0], [1,-1], [2,0]
]

export const J = [
	[0,0], [0,-1], [1,0], [2,0]
]

export const L = [
	[0,0], [1,0], [2,0], [2,-1]
]

export const O = [
	[0,0], [0,-1], [1,0], [1,-1]
]

export const S = [
	[0,0], [1,0], [1,-1], [2,-1]
]

export const Z = [
	[0,-1], [1,-1], [1,0], [2,0]
]
