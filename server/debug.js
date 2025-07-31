const debugMode = process.env.DEBUG

const RED = "\u001b[31m"
const RESET = "\u001b[0m"
const GREEN = "\u001b[32m"

export function log(str, ...args) {
	var out = str + " ";

	if (debugMode === "true") {
		args.forEach(element => {
			out += element + " "
		});
		console.log(out)
	}
}

function append(args) {
	var string = ""
	args.forEach(element => {
		string += element + " "
	})
	return (string)
}

class RoomDebug {
	constructor() {}

	roomlog(room, ...args) {
		const roomString = RED + "Room " + room.getCode() + ": " + RESET
		const out = append(args)
		console.log(roomString + out)
	}

	printPlMap(room) {
		const plMap = room.getPlMap()
		this.roomlog(room, "Printing PlayerMap:")
		plMap.forEach(player => {
			console.log("- Player", player.toString())
		})
		this.roomlog(room, "Finish PlayerMap")
	}

	printLeaderboard(room) {
		const leaderboard = room.getLeaderboard().toReversed()
		this.roomlog(room, "Printing Leaderboard:")
		for (let place = 0; place < leaderboard.length; place++) {
			console.log(place + 1, "-", leaderboard[place].playerName)
		}
		this.roomlog(room, "Finish Leaderboard")
	}
}

class PlayerDebug {
	constructor() {}

	playerlog(player, ...args) {
		const playerString = GREEN + player.toString() + ": " + RESET
		const out = append(args)
		console.log(playerString + out)
	}

	printTargets(player) {
		const targets = player.getTargetManager().getTargets()
		this.playerlog(player, "Printing Targets:")
		targets.forEach(target => {
			console.log("-", target.toString())
		})
		this.playerlog(player, "Finish Targets:")
	}
}

export const playerDebug = new PlayerDebug()
export const roomDebug = new RoomDebug()
