export const TICKS = 60
export const ROWS = 20
export const COLUMNS = 10

export const Actions = {
	HARD_DROP: 1,
	SOFT_DROP: 2,
	HOLD: 3,
	ROTATE_LEFT: 4,
	ROTATE_RIGHT: 5,
	MOVE_RIGHT: 6,
	MOVE_LEFT: 7
}

// Possibly a common structure between front and back
export const Colors = {
	GHOST: -1,
	BLUE: 1,
	PURPLE: 2,
	DARK_BLUE: 3,
	ORANGE: 4,
	YELLOW: 5,
	GREEN: 6,
	RED: 7,
}

export const ScoreTable = {
	1: 100,
	2: 300,
	3: 500,
	4: 800,
	"COMBO": 50,
	"SOFT_DROP": 1,
	"HARD_DROP": 2
}

export const LevelTable = {
	1: 60,
	2: 50,
	3: 40,
	4: 30,
	5: 25,
	6: 20,
	7: 15,
	8: 10,
	9: 5,
	10: 1
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
