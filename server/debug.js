const debugMode = process.env.DEBUG

export function log(str, ...args) {
	var out = str + " ";

	if (debugMode === "true") {
		args.forEach(element => {
			out += element + " "
		});
		// console.log(out)
	}
}
