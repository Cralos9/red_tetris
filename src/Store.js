"use client"

export const createStore = (reducer, initState) => {
	const store = {
		state: initState,
		middlewares: [],
		listeners: [],
		applyMiddleWare: (middleware) => {
			store.middlewares.push(middleware)
		},
		dispatch: (action) => {
			store.middlewares.forEach(middleware => middleware(action, store))
			store.state = reducer(store.state, action)
			store.listeners.forEach(cb => { cb() })
		},
		subscribe: (cb) => {
			store.listeners.push(cb)
		},
		getState: () => store.state
	}
	return (store)
}
