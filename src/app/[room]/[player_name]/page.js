'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RoomPage() {
  const params = useParams();
  const [username, setUsername] = useState('');
  const roomCode = params.room;
  const name = params.player_name;

  useEffect(() => {
    if (name) {
      localStorage.setItem("username", name);
      setUsername(name);
    }
  }, [name]);

  return (
    <div>
      <h1>Room: {roomCode}</h1>
      <h1>Name: {username}</h1>
    </div>
  );
}
