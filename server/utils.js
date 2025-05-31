export function randomNbr(max) {
	return Math.floor(Math.random() * max) 
}

export function compare(a, b) {
	return (a[0] - b[0])
}

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

export function getRotations(pos) {
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

export function getRandomOrder(arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
		const rNbr = randomNbr(i);
		const tmp = arr[i]
		arr[i] = arr[rNbr]
		arr[rNbr] = tmp
	}
}
