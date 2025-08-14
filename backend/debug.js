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

export function printArr(arr) {
	var str = "[ "

	arr.forEach((ele) =>{
		str += ele.toString() + " "
	})
	str += "]"
	return (str)
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
		if (targets !== null) {
			targets.forEach(target => {
				console.log("-", target.toString())
			})
		}
		this.playerlog(player, "Finish Targets:")
	}
}

export const playerDebug = new PlayerDebug()
