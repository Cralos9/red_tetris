import { Routes, Route } from "react-router-dom";
import Main from "./pages/page.jsx";
import Options from "./pages/options/page.jsx";
import Game from "./pages/game/page.jsx";
import Keys from "./pages/options/keys/page.jsx";
import RoomPlayer from "./pages/room/page.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/options" element={<Options />} />
      <Route path="/game" element={<Game />} />
      <Route path="/options/keys" element={<Keys />} />
      <Route path="/:room/:player_name" element={<RoomPlayer />} />
    </Routes>
  );
}
