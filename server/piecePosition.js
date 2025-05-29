function compare(a, b) {
	return (a[0] - b[0])
}

function getSkirt(pos) {
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

function getRotations(pos) {
	let rot = []

	// (x,y) -> (-y,x)
	for (let i = 0; i < pos.length; i++) {
		let arr = []
		arr[0] = -1 * pos[i][1]
		arr[1] = pos[i][0]
		rot.push(arr)
	}
	//console.log(rot)
	return (rot)
}


const I = [
	[
		[-2,0], [-1,0], [0,0], [1,0]
	],
]

const T = [
	[
		[-1,0], [0,0], [0,-1], [1,0]
	],
]

const J = [
	[
		[-1,0], [-1,-1], [0,0], [1,0]
	],
]

const L = [
	[
		[-1,0], [0,0], [1,0], [1,-1]
	],
]

const O = [
	[
		[0,0], [0,-1], [1,0], [1,-1]
	],
]

const S = [
	[
		[-1,0], [0,0], [0,-1], [1,-1]
	],
]

const Z = [
	[
		[-1,-1], [0,-1], [0,0], [1,0]
	],
]

export const pieces = [I, T, J, L, O, S, Z]
export const skirts = []
for (let i = 0; i < pieces.length; i++) {
	const piece = pieces[i]
	const skirt = [getSkirt(piece[0])]
	for (let k = 0; k < 3; k++) {
		const tmp = getRotations(piece[k]).sort(compare)
		skirt.push(getSkirt(tmp))
		piece.push(tmp)
	}
	skirts.push(skirt)
	//console.log("Skirt", skirt)
	//console.log(piece)
	//console.log("")
}

