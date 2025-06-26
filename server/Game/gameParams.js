export const ROWS = 20
export const COLUMNS = 10

export const SPEED = 1

export const keyBinds = {
	HARDDROP: " ",
	HOLD: "c",
	MOVELEFT: "ArrowLeft",
	MOVERIGHT: "ArrowRight",
	ROTATELEFT: "z",
	ROTATERIGHT: ["x", 'ArrowUp'],
	SOFTDROP: "ArrowDown"
}

export const Icoor = [
	[
		[-1,0], [0,0], [1,0], [2,0]
	],
]

export const Tcoor = [
	[
		[-1,0], [0,0], [0,-1], [1,0]
	],
]

export const Jcoor = [
	[
		[-1,0], [-1,-1], [0,0], [1,0]
	],
]

export const Lcoor = [
	[
		[-1,0], [0,0], [1,0], [1,-1]
	],
]

export const Ocoor = [
	[
		[0,0], [0,-1], [1,0], [1,-1]
	],
]

export const Scoor = [
	[
		[-1,0], [0,0], [0,-1], [1,-1]
	],
]

export const Zcoor = [
	[
		[-1,-1], [0,-1], [0,0], [1,0]
	],
]

export const JLTSZoffsets = [
	[
		[0,0], [0,0], [0,0], [0,0], [0,0]
	],
	[
		[0,0], [1,0], [1,1], [0,-2], [1,-2]
	],
	[
		[0,0], [0,0], [0,0], [0,0], [0,0]
	],
	[
		[0,0], [-1,0], [-1,1], [0,-2], [-1,-2]
	]
]

export const Ioffsets = [
	[
		[0,0], [-1,0], [2,0], [-1,0], [2,0]
	],
	[
		[-1,0], [0,0], [0,0], [0,-1], [0,2]
	],
	[
		[-1,-1], [1,-1], [-2,-1], [1,0], [-2,0]
	],
	[
		[0,-1], [0,-1], [0,-1], [0,1], [0,-2]
	]
]

export const Ooffsets = [
	[
		[0,0]
	],
	[
		[0,1]
	],
	[
		[-1,1]
	],
	[
		[-1,0]
	]
]
