import GameManager from "./GameManager.js";
import Debug from "debug"
import { beforeEach, describe, expect, jest } from "@jest/globals"
import { GAMEMODES } from "../common.js";
import { createGarbage42, createGarbageTetris } from "./Game/Strategy/CreateGarbage.js";
import { patternMatch42, patternMatchTetris } from "./Game/Strategy/PatternMatch.js";
import { garbageCalculation42, garbageCalculationTetris } from "./Game/Strategy/GarbageCalculation.js";

jest.unstable_mockModule('./Room.js', () => ({
	default: jest.fn().mockImplementation(() => ({
		getLog: () => Debug('Room'),
		endGame: jest.fn(),
		getCode: jest.fn(),
		getGamemode: jest.fn()
	}))
}))

jest.unstable_mockModule('./Player.js', () => ({
	default: jest.fn().mockImplementation(() => ({
		startGame: jest.fn(),
		stopGame: jest.fn(),
		toObject: jest.fn()
	}))
}))

const Room = (await import('./Room.js')).default
const Player = (await import('./Player.js')).default

describe('GameManager Tests', () => {
	let gameManager, players, room, spyEndGame

	beforeEach(() => {
		room = new Room()
		players = [
			new Player(),
			new Player(),
			new Player(),
		]
		gameManager = new GameManager(room, players)
		players.forEach(player => {
			player.startGame.mockClear()
			player.stopGame.mockClear()
			player.toObject.mockClear()
		})
		spyEndGame = jest.spyOn(room, 'endGame')
		room.endGame.mockClear()
	})

	it('StartGame', () => {
		gameManager.startGame()
		players.forEach(player => {
			expect(player.stopGame.mock.calls).toHaveLength(1)
			expect(player.startGame.mock.calls).toHaveLength(1)
		})
	})

	it('Remove Player midGame', () => {
		const player = players[0]
		gameManager.removePlayer(player)
		expect(player.stopGame.mock.calls).toHaveLength(1)
	})

	it('GetOtherPlayers', () => {
		const filterPlayer = players[0]
		const otherPlayers = gameManager.getOtherPlayers(filterPlayer)
		const expArr = []
		for (let i = 1; i < players.length; i++) {
			expArr.push(players[i])
		}
		expect(otherPlayers).toStrictEqual(expArr)
	})

	describe('Gamemode Tests', () => {
		let out

		const check = (cgStrat, pmStrat, gcStrat) => {
			expect(out.createGarbage).toBe(cgStrat)
			expect(out.patternMatch).toBe(pmStrat)
			expect(out.gbCalc).toBe(gcStrat)
		}

		it('Get Tetris Gamemode', () => {
			room.getGamemode.mockImplementation(() => GAMEMODES.Tetris)
			out = gameManager.getGamemode()
			check(createGarbageTetris, patternMatchTetris, garbageCalculationTetris)
		})

		it('Get Base Gamemode', () => {
			room.getGamemode.mockImplementation(() => GAMEMODES.Base)
			out = gameManager.getGamemode()
			check(createGarbage42, patternMatch42, garbageCalculation42)
		})
	})


	describe('HandleLoss', () => {
		beforeEach(() => {
			spyEndGame.mockClear()
			gameManager.startGame()
			players.forEach(player => {
				player.stopGame.mockClear()
			})
		})

		it('Player Loss', () => {
			const player = players[0]
			gameManager.handleLoss(player)
			expect(gameManager.getLeaderboard()).toHaveLength(1)
			expect(player.toObject.mock.calls).toHaveLength(1)
			expect(room.endGame.mock.calls).toHaveLength(0)
		})

		it('EndGame', () => {
			const nbrPlayers = players.length
			for (let i = 0; i < nbrPlayers; i++) {
				gameManager.handleLoss(players[i])
			}
			players.forEach(player => {
				//expect(player.stopGame.mock.calls).toHaveLength(1)
			})
			expect(room.endGame.mock.calls).toHaveLength(1)
		})
	})
})
