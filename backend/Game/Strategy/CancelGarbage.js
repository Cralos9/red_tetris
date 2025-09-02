import Strategy from "./Strategy.js";

export class CancelGarbage42 extends Strategy {
	constructor() { super() }

	execute(tm, linesCleared) {
		return linesCleared
	}
}

export class CancelGarbageTetris extends Strategy {
	constructor() { super() }

	execute(tm, linesCleared) {
		while (tm.garbageStack.empty() === false && linesCleared >= tm.garbageStack.top().lines) {
			linesCleared -= tm.garbageStack.top().lines
			tm.garbageStack.pop()
		}
		if (tm.garbageStack.size() > 0 && linesCleared > 0) {
			tm.garbageStack.top().lines -= linesCleared
			linesCleared = 0
		}
		return (linesCleared)
	}
}
