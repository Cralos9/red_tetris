'use client';
import Image from "next/image";

export default function Home() {
  function Game()
  {
    console.log("Game")
  }
  function Login()
  {
    console.log("Game")
  }
  function SignOut()
  {
    console.log("Game")
  }
  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"></link>
      <div className="header">
          <h1 className="title"> Dr Tetris</h1>
        <div className="logButton-cont">
          <button onClick={Login} className="logButton">Log In</button>
          <button onClick={SignOut} className="logButton">Sign Out</button>
        </div>
      </div>
      <img className="image" src="/images/images.png" alt="Mario"></img>
      <div className="button-container">
          <button onClick={Game} className="button">Game</button>
          <button className="button">Leaderboard</button>
          <button className="button">Profile</button>
      </div>
    </div>
  );
}

