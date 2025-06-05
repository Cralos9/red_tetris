export class Player {
	constructor(name, roomCode) {
		this.name = name
		this.roomCode = roomCode
	}

	toString() {
		return `Player ${this.name}`
	}
}
