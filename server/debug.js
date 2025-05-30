const debugMode = false

export function log(str, ...args) {
	var out = str + " ";

	if (debugMode) {
		args.forEach(element => {
			out += element + " "
		});
		console.log(out)
	}
}
