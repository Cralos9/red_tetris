const TICK_RATE = 60
export const DELTA_TIME = Math.round((1 / TICK_RATE) * 1000)

export const LEVEL_INTERVAL = 30000

// Need to make this delay dynamic during the match
export const GARBAGE_DELAY = 5000

export const ROWS = 21
export const COLUMNS = 10

export const MAX_SHIFTS = 15

export const GAME_EVENTS = {
	LINE_CLEAR: "LINE_CLEAR",
	HARD_DROP: "HARD_DROP",
	SOFT_DROP: "SOFT_DROP",
	MOVE: "MOVE",
	ROTATION: "ROTATION"
}

export const ScoreTable = {
	0: 0,
	1: 100,
	2: 300,
	3: 500,
	4: 800,
	"COMBO": 50,
	"SPIN": 2,
	[GAME_EVENTS.SOFT_DROP]: 1,
	[GAME_EVENTS.HARD_DROP]: 2
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

export const Icoor = [ [-1,0], [0,0], [1,0], [2,0] ]
export const Tcoor = [ [-1,0], [0,0], [0,-1], [1,0] ]
export const Jcoor = [ [-1,0], [-1,-1], [0,0], [1,0] ]
export const Lcoor = [ [-1,0], [0,0], [1,0], [1,-1] ]
export const Ocoor = [ [0,0], [0,-1], [1,0], [1,-1] ]
export const Scoor = [ [-1,0], [0,0], [0,-1], [1,-1] ]
export const Zcoor = [ [-1,-1], [0,-1], [0,0], [1,0] ]

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
