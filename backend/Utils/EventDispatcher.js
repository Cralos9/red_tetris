export default class EventDispatcher {
	constructor() {
		this.observers = new Map()
	}

	subscribe(event, callback) {
		const arr = this.observers.get(event)

		if (arr === undefined) {
			this.observers.set(event, [callback])
			return (1)
		} else if (arr.find(cb => cb === callback)) {
			console.log("Error: Duplicate callback")
			return (0)
		}
		arr.push(callback)
		return (1)
	}

	notify(state, event) {
		const arr = this.observers.get(event)

		if (arr === undefined) {
			console.log("No Callbacks for", event)
			return (0)
		}
		arr.forEach(callback => { callback(state) })
		return (1)
	}
}
