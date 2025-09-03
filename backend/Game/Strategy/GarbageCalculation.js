import Strategy from "./Strategy.js";

export class GarbageCalculation42 extends Strategy {
	constructor() { super() }

	execute(tm, linesCleared, combo, pieceSpin) {
		return (linesCleared - 1)
	}
}

export class GarbageCalculationTetris extends Strategy {
	constructor() { super() }

	execute(tm, linesCleared, combo, pieceSpin) {
		while (tm.garbageStack.empty() === false && linesCleared >= tm.garbageStack.top().lines) {
			linesCleared -= tm.garbageStack.top().lines
			tm.garbageStack.pop()
		}
		if (tm.garbageStack.size() > 0 && linesCleared > 0) {
			tm.garbageStack.top().lines -= linesCleared
			linesCleared = 0
		}
		const spinBonus = pieceSpin ? 3 : 1
		const garbageLines = ((linesCleared - 1) * spinBonus) + (combo - 1)
		return (garbageLines)
	}
}
