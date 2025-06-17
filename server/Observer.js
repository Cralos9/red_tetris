export class Observer {
	constructor() {
		this.subs = []
	}

	subscribe(sub) {
		this.subs.push(sub)
	}

	unsubscribe(sub) {
		// Delete sub
	}

	notify() {
		this.subs.forEach(sub => sub.update())
	}
}
