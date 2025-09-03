'use client';
import Link from 'next/link';
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation';

export default function Game() {
  	const router = useRouter();
  	const [scores, setScores] = useState([]);
  	var gameInt = 0;
  	const gameModes =
	[
		"42",
		"Tetris"
	]

  	function getOrdinal(n) {
		const s = ["th", "st", "nd", "rd"],
		  	v = n % 100;
		return (n + (s[(v - 20) % 10] || s[v] || s[0]));
  	}

  	useEffect(() => {
		const foundScores = [];
  
		for (let i = 0; i < localStorage.length; i++) 
		{
	  		const key = localStorage.key(i);
	  		if (key && key.startsWith("Score")) {
			const value = localStorage.getItem(key);
			if (value) {
		  		const [name, scoreStr] = value.split(" ");
		  		const score = parseInt(scoreStr, 10);
		  	if (!isNaN(score)) {
				foundScores.push({ name, score });
		  	}
			}
	  	}
		}
  
	foundScores.sort((a, b) => b.score - a.score);
	const topFormatted = foundScores.slice(0, 3).map(entry => `${entry.name} ${entry.score}`);
  
	setScores(topFormatted);
	}, []);
  

  function enterRooms(e) {
	e.preventDefault();
	const input = document.getElementById('input');
	const room = input.value;
	if(!input.value || !input.value.match(/^[0-9a-zA-Z]+$/))
	{
		if (!input.value)
			input.placeholder = "Must have a room code";
		else
		{
			input.placeholder = "Only alphanumeric characters";
			input.style.fontSize = '16px';
		}
		input.classList.add("error-placeholder");
		input.classList.add("shake")
		input.value = "";
		return;
	}
	const user = localStorage.getItem("username");
	gameMode = document.getElementById("gameMode")
	localStorage.setItem("gameMode",gameMode.textContent)
	router.push(`/${room}/${user}`);
  }

  function options()
  {
	router.push("/options");
  }

  function gameMode()
  {
	gameMode = document.getElementById("gameMode")
	gameInt++;
	if (gameInt == gameModes.length)
		gameInt = 0;
	gameMode.textContent = gameModes[gameInt]
  }

  return (
	<div className="main-container">
	  <form className="usercard" onSubmit={enterRooms}>
		<h2 className='userTitle'>Game Mode</h2>
		<button  type='button' onClick={gameMode} className="button" id="gameMode">42</button>
		<h2 className="userTitle">Game Code</h2>
		<div>
			<input className='input' placeholder='Enter room code' maxLength={16} id='input'></input>
		</div>
			<button className="button">
			  <img className="mario-run" src="/images/mario.gif" />
			  <img className="goomba-run" src="/images/goomba2.gif"  />
			  <span className='text-container'>Play</span>
			</button>
			<button type='button' className='button' onClick={options}>
				Options
			</button>
	  </form>
	  <div className="usercard">
		<h2 className="userTitle">YOUR SCORES</h2>
		<h3 style={{ color: 'white' }}>USER SCORE</h3>
		{scores.map((s, idx) => (
			<div key={idx}>
			<h3 style={{ color: 'white' }}>{getOrdinal(idx + 1)} {s}</h3>
			{idx !== scores.length - 1 && <hr style={{color: 'white'}} />}
			</div>
		))}
		</div>
	</div>
  );
}
