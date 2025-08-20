import { jest } from "@jest/globals"

jest.unstable_mockModule('./Game/GameController.js', () => ({
	default: jest.fn(),
}))

const Room = (await import('./Room.js')).default
const Player = (await import('./Player.js')).default

describe('Room Tests', () => {
	const room = new Room(1)
	const player1 = new Player("Lol", null, null, 123)
	const player2 = new Player("Pol", null, null, 124)
	const expRoomPlayers = new Map()
	
	test('Add Player1', () => {
		room.addPlayer(player1)
		expRoomPlayers.set(player1.id, player1)
		const outRoomPlayers = room.plMap
		expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
	})

	test('Add Player 2', () => {
		room.addPlayer(player2)
		expRoomPlayers.set(player2.id, player2)
		const outRoomPlayers = room.plMap
		expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
	})

	test('Search Player Tests', () => {
		const outPlayer = room.getPlayer(player2.id)
		const expPlayer = player2
		expect(outPlayer).toBe(expPlayer)
	})
})
