import './globals.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <div className="main-container">
        <form className='usercard'>
          <h2 className='userTitle'>Username</h2>
          <div>
            <input className='input' placeholder='Enter an username' maxLength={16}></input>
          </div>
          <Link href="/game" className="button">Play</Link>
        </form>
{/*         <Link href="/game" className="centerButton">Create Room</Link>
        <Link href="/roomKey" className="centerButton">Game Room Code</Link> */}
      </div>
    </div>
  );
}
