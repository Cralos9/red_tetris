export const ACTIONS = {
	HARD_DROP: 1,
	SOFT_DROP: 2,
	HOLD: 3,
	ROTATE_LEFT: 4,
	ROTATE_RIGHT: 5,
	MOVE_RIGHT: 6,
	MOVE_LEFT: 7
}

export const COLORS = {
	GHOST: -1,
	EMPTY: 0,
	BLUE: 1,
	PURPLE: 2,
	DARK_BLUE: 3,
	ORANGE: 4,
	YELLOW: 5,
	GREEN: 6,
	RED: 7,
}

export const GAMEMODES = {
	Tetris: "Tetris",
	Base: "42"
}

export const Icoor = [ [-1,0], [0,0], [1,0], [2,0] ]
export const Tcoor = [ [-1,0], [0,0], [0,-1], [1,0] ]
export const Jcoor = [ [-1,0], [-1,-1], [0,0], [1,0] ]
export const Lcoor = [ [-1,0], [0,0], [1,0], [1,-1] ]
export const Ocoor = [ [0,0], [0,-1], [1,0], [1,-1] ]
export const Scoor = [ [-1,0], [0,0], [0,-1], [1,-1] ]
export const Zcoor = [ [-1,-1], [0,-1], [0,0], [1,0] ]
