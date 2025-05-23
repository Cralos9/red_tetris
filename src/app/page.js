'use client';
import './globals.css';
import Link from 'next/link';
import {useState} from 'react'
import { useRouter } from 'next/navigation';


export default function Home() {
  const [username, setUsername] = useState();
  const router = useRouter();
  function handleButton(e)
  {
    e.preventDefault();
    const name = document.getElementById('username').value
    if(!name)
    {
      alert("must have user");
      return;
    }
    localStorage.setItem("username", name);
    router.push('/game');
  }

  return (
    <div>
      <div className="main-container">
        <form className='usercard'>
          <h2 className='userTitle'>USERNAME</h2>
          <div>
            <input className='input' placeholder='Enter username' maxLength={16} id='username'></input>
          </div>
          <button onClick={handleButton} className="button">Play</button>
        </form>
{/*         <Link href="/game" className="centerButton">Create Room</Link>
        <Link href="/roomKey" className="centerButton">Game Room Code</Link> */}
      </div>
    </div>
  );
}
