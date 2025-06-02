const move = {
	x: 0,
	y: 0,
	r: 0,
	hold: false
}

let time

export function setTime(varTime) {
	time = varTime
}

export function getTime() {
	return (time)
}

export function moveHorizontal(x) {
	move.x = x
}

export function moveVertical(y) {
	move.y = y
}

export function holdPiece(flag) {
	move.hold = flag
}

export function rotation(r) {
	move.r = r
}

export function getMoves() {
	return (move)
}
