// src/Layout.jsx
import './cssFiles/globals.css';
import './cssFiles/buttons.css';
import './cssFiles/board.css';
import ClientRoutes from './clientLayout';
import { StoreContext } from "./Contexts"
import { createStore } from "./Store"

const reducer = (state, action) => {
	console.log("Received a state update", action)
}

const loggerMiddleWare = (action) => {
	console.log("MiddleWare Intercepted an Action:", action.type, action.payload)
}

const store = createStore(reducer)
store.applyMiddleWare(loggerMiddleWare)

export default function Layout() {
  return (
    <div>
      <div className="header">
        <h1 className="title">Dr.Tetris</h1>
      </div>

      <img className="shroom-img" src="/images/shroom.png" alt="Shroom" />
      <img className="piranha-img" src="/images/piranha.png" alt="Piranha" />
      <img className="mario-img" src="/images/images.png" alt="Mario" />

	  <StoreContext value={store}>
		<ClientRoutes />
	  </StoreContext>
    </div>
  );
}
