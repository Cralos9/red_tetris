export default class PRNG {
	constructor(seed) {
		this.seed = seed
		this.m = Math.pow(2, 31) - 1
		this.a = 1103515245
		this.c = 12345
	}

	setSeed(newSeed) { this.seed = newSeed }

	rand() {
		const randNbr = (this.a * this.seed + this.c) % this.m
		this.seed = randNbr
		return (randNbr)
	}

	randRange(min, max) {
		const value = this.rand() / this.m
		const diff = max - min
		return (Math.floor((diff * value) + min))
	}
}
