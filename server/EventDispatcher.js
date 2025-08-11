export class EventDispatcher {
	constructor() {
		this.observers = new Map()
	}

	subscribe(event, callback) {
		const arr = this.observers.get(event)

		if (arr === undefined) {
			this.observers.set(event, [callback])
			return
		} else if (arr.find(cb => cb === callback)) {
			console.log("Error: Duplicate callback")
			return
		}
		arr.push(callback)
	}

	notify(state, event) {
		const arr = this.observers.get(event)

		if (arr === undefined) {
			console.log("No Callbacks for", event)
			return
		}
		arr.forEach(callback => { callback(state) })
	}
}
