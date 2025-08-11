import { Room } from "./Room.js"
import { Player } from "./Player.js"

describe('Room Tests', () => {
	const room = new Room()
	const player1 = new Player("Lol", null, 123)
	const player2 = new Player("Pol", null, 124)
	const expRoomPlayers = new Map()
	
	test('Add Player1', () => {
		room.addPlayer(player1.id, player1)
		expRoomPlayers.set(player1.id, player1)
		const outRoomPlayers = room.plMap
		expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
	})

	test('Add Player 2', () => {
		room.addPlayer(player2.id, player2)
		expRoomPlayers.set(player2.id, player2)
		const outRoomPlayers = room.plMap
		expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
	})

	test('Search Player Tests', () => {
		const outPlayer = room.searchPlayer(player2.id)
		const expPlayer = player2
		expect(outPlayer).toBe(expPlayer)
	})

	test('Leave Player Tests', () => {
		room.leavePlayer(player1.id)
		const outRoomPlayers = room.plMap
		expRoomPlayers.delete(player2.id)
		expect(outRoomPlayers).toStrictEqual(expRoomPlayers)
	})
})
