'use client';
import Link from 'next/link';
import {useState} from 'react'
import { useRouter } from 'next/navigation';

export default function Game() {
  const router = useRouter();
  
  function enterRooms(e) {
    e.preventDefault();
    const room = document.getElementById('room').value;
    if(!room)
        return;
    const user = localStorage.getItem("username");
    router.push(`/${room}/${user}`);
  }

  return (
    <div className="main-container">
      <form className="usercard" onSubmit={enterRooms}>
        <h2 className="userTitle">Game Code</h2>
        <div>
          <input className="input" placeholder="Enter game code" maxLength={16} id="room" />
        </div>
            <button className="button">
              <img className="mario" src="images/mario.gif" alt="Mario" />
              <img className="goomba" src="images/goomba2.gif" alt="Goomba" />
              <span className='text-container'>Play</span>
        </button>
      </form>
    </div>
  );
}
