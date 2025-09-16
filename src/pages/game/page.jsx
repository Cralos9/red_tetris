'use client';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Game() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [gameInt, setGameInt] = useState(0);
  const gameModes = ["42", "Tetris"];
  const roomInputRef = useRef();
  const [gameMode, setGameMode] = useState(gameModes[0]);

  // Load scores from localStorage
  useEffect(() => {
    const foundScores = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("Score")) {
        const value = localStorage.getItem(key);
        if (value) {
          const [name, scoreStr] = value.split(" ");
          const score = parseInt(scoreStr, 10);
          if (!isNaN(score)) foundScores.push({ name, score });
        }
      }
    }
    foundScores.sort((a, b) => b.score - a.score);
    const topFormatted = foundScores.slice(0, 3).map(entry => `${entry.name} ${entry.score}`);
    setScores(topFormatted);
  }, []);

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Handle "Play" button
  const enterRooms = (e) => {
    e.preventDefault();
    const room = roomInputRef.current.value.trim();
    const user = localStorage.getItem("username");

    if (!room || !room.match(/^[0-9a-zA-Z]+$/)) {
      roomInputRef.current.placeholder = room ? "Only alphanumeric characters" : "Must have a room code";
      roomInputRef.current.classList.add("error-placeholder", "shake");
      roomInputRef.current.value = "";
      return;
    }

    localStorage.setItem("gameMode", gameMode);
    navigate(`/${room}/${user}`);
  };

  const options = () => navigate("/options");

  const toggleGameMode = () => {
    const nextIndex = (gameInt + 1) % gameModes.length;
    setGameInt(nextIndex);
    setGameMode(gameModes[nextIndex]);
  };

  return (
    <div className="app-container">

    <div className="main-container">
      <form className="usercard" onSubmit={enterRooms}>
        <h2 className='userTitle'>Game Mode</h2>
        <button type='button' onClick={toggleGameMode} className="button">{gameMode}</button>

        <h2 className="userTitle">Game Code</h2>
        <div>
          <input ref={roomInputRef} className='input' placeholder='Enter room code' maxLength={16} />
        </div>

        <button type='submit' className="button">
          <img className="mario-run" src="/images/mario.gif" />
          <img className="goomba-run" src="/images/goomba2.gif" />
          <span className='text-container'>Play</span>
        </button>

        <button type='button' className='button' onClick={options}>Options</button>
      </form>

      <div className="usercard">
        <h2 className="userTitle">YOUR SCORES</h2>
        {scores.map((s, idx) => (
          <div key={idx}>
            <h3 style={{ color: 'white' }}>{getOrdinal(idx + 1)} {s}</h3>
            {idx !== scores.length - 1 && <hr style={{ color: 'white' }} />}
          </div>
        ))}
      </div>
    </div>
        </div>
  );
}
