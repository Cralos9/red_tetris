'use client';

import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Options from './pages/options/page';
import Game from './pages/game/page';
import Keys from './pages/options/keys/page';
import RoomPlayer from './pages/room/page';
import PopStateHandler from './popStateHandler';
import Main from './pages/page';


// const BrowserRouter = dynamic(
//   () => import('react-router-dom').then(mod => mod.BrowserRouter),
//   { ssr: false }
// );

export default function ClientRoutes() {
  return (
    <BrowserRouter>
      <PopStateHandler />
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/options" element={<Options />} />
        <Route path="/game" element={<Game />} />
        <Route path="/options/keys" element={<Keys />} />
        <Route path="/:room/:player_name" element={<RoomPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}
