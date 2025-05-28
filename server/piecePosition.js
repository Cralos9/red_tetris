export function getSkirt(pos) {
	let arr = []
	let i = 0
	let lowerY

	while (i < pos.length) {
		lowerY = pos[i]
		while (i < pos.length && pos[i][0] === lowerY[0]) {
			if (pos[i][1] >= lowerY[1]) {
				lowerY = pos[i]
			}
			i++
		}
		arr.push(lowerY)
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
