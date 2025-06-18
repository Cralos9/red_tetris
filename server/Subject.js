export class Subject {
	constructor() {
		this.observers = []
	}

	addObserver(observer) {
		this.observers.push(observer)
	}

	removeObserver(elimObserver) {
		this.observers = this.observers.filter(observer => elimObserver === observer)
	}

	notify(state) {
		this.observers.forEach(observer => observer.update(state))
	}
}
