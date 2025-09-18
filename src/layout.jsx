// src/Layout.jsx
import './cssFiles/globals.css';
import './cssFiles/buttons.css';
import './cssFiles/board.css';
import ClientRoutes from './clientLayout';
import { Provider } from 'react-redux'
import { store } from "./Store"

export default function Layout() {
  return (
    <div>
      <div className="header">
        <h1 className="title">Dr.Tetris</h1>
      </div>

      <img className="shroom-img" src="/images/shroom.png" alt="Shroom" />
      <img className="piranha-img" src="/images/piranha.png" alt="Piranha" />
      <img className="mario-img" src="/images/images.png" alt="Mario" />

	  <Provider store={store}>
		<ClientRoutes />
	  </Provider>
    </div>
  );
}
