'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoomPage() {
  const params = useParams();
  const roomCode = params.room;
  const name = params.player_name;
  const score = 30000;
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (name) {
      setUsername(name);
    }
  }, [name]);
  function scoreSave() {
    if (name && score !== undefined) {
      localStorage.setItem("username", name);

      let maxScoreIndex = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("Score")) {
          const num = parseInt(key.replace("Score", ""), 10);
          if (!isNaN(num) && num > maxScoreIndex) {
            maxScoreIndex = num;
          }
        }
      }
      const nextKey = `Score${maxScoreIndex + 1}`;
      localStorage.setItem(nextKey, `${name} ${score}`);
    }
  }

  return (
    <div>
      <h1>Room: {roomCode}</h1>
      <h1>Name: {username}</h1>
      <div className="game-wrapper">
        <div className="held-piece">
          <span className="held-label">Held Piece</span>
        </div>
        <div className="next-piece">
        <span className="held-label">Next Pieces</span>
        </div>
        <div className="game-bottle"></div>
      </div>
      {/* <div className='secondary-games'>
        <div className='secondary-game'></div>
        <div className='secondary-game'></div>
        <div className='secondary-game'></div>
        <div className='secondary-game'></div>
        <div className='secondary-game'></div>
        <div className='secondary-game'></div>
      </div> */}
      <div className='button-container'>
        <button onClick={scoreSave} className='buttons'>Start</button>
        <button className='buttons'>Reset</button>
      </div>
    </div>
  );
}
