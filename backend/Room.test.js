import { jest } from "@jest/globals"

jest.unstable_mockModule('./Game/GameController.js', () => ({
	default: jest.fn(),
}))

jest.unstable_mockModule('./GameManager.js', () => ({
	default: jest.fn().mockImplementation(() => ({
		startGame: jest.fn()
	})),
}))

const GameManager = (await import('./GameManager.js')).default
const Room = (await import('./Room.js')).default
const Player = (await import('./Player.js')).default

describe('Room Tests', () => {
	const room = new Room(123, null)
	const player1 = new Player("Lol", null, null, 123)
	const player2 = new Player("Pol", null, null, 124)
	const expRoomPlayers = new Map()

	describe('Adding/Remove Players', () => {
		it('Add Player1', () => {
			room.addPlayer(player1)
			expRoomPlayers.set(player1.getId(), player1)
			const outRoomPlayers = room.plMap
			expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
		})

		it('Add Player 2', () => {
			room.addPlayer(player2)
			expRoomPlayers.set(player2.getId(), player2)
			const outRoomPlayers = room.plMap
			expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
		})
	})

	it('Starting a Game', () => {
		room.startGame()
		expect(room.getGameStatus()).toEqual(true)
		expect(GameManager).toHaveBeenCalledTimes(1)
		expect(room.getGameManager().startGame.mock.calls).toHaveLength(1)
	})

	it('Search Player Tests', () => {
		const room = new Room(134, null)
		room.addPlayer(player2)
		const outPlayer = room.getPlayer(player2.getId())
		const expPlayer = player2
		expect(outPlayer).toBe(expPlayer)
	})
})
