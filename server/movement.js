const move = {
	x: 0,
	r: 0
}

export function moveHorizontal(x) {
	move.x = x
}

export function rotation(r) {
	move.r = r
}

export function getMoves() {
	return (move)
}
