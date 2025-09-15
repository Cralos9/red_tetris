'use client';

import { Routes, Route } from 'react-router-dom';
import Options from './components/pages/options/page';
import Game from './components/pages/game/page';
import Keys from './components/pages/options/keys/page';
import RoomPlayer from './components/pages/player/page';
import PopStateHandler from './components/popStateHandler';
import Main from './components/pages/page';

import dynamic from 'next/dynamic';

const BrowserRouter = dynamic(
  () => import('react-router-dom').then(mod => mod.BrowserRouter),
  { ssr: false }
);

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
