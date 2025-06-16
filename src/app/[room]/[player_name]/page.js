'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from "../../../socket";
import  gameDraw  from "./functions";

export default function RoomPage() {
	const gifs = [
		"/images/blue_virus.gif",
		"/images/yellow_virus.gif",
		"/images/red_virus.gif"
	  ];
	const params = useParams();
	const roomCode = params.room;
	const [gameOver, setGameOver] = useState(false);

	const name = params.player_name;
	const score = 40000;
	var game_amount = 3;
	const [username, setUsername] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	
	function end_game() {
	  setIsDisabled(false);
	  setGameOver(true);
	}

	useEffect(() => {
		socket.connect();
	  
		function handleConnect() {
			console.log("Connection Accepted")
		}

		socket.on("connect", handleConnect);

		return function cleanup() {
			socket.off("connect", handleConnect);
		};
	}, []);

	useEffect(() => {
		socket.emit('joinRoom', {playerName: name, roomCode: roomCode})
		socket.on('join', (msg) => 
		{
			var otherBoards = msg.playerIds
			console.log(otherBoards.length)
			for(var i = 0; i <= otherBoards.length; i++)
			{
				if(otherBoards[i] === socket.id || otherBoards[i] === undefined)
					continue;
				let otherBoard = document.getElementById(otherBoards[i]);
				if (!otherBoard) 
				{
					otherBoard = document.createElement('div');
					otherBoard.className = 'secondary-game';
					otherBoard.id = otherBoards[i];
					gameDraw.add_secondary_cells(otherBoard, 200);
					document.querySelector('.secondary-games').appendChild(otherBoard);
				}
			}
		})
		socket.on('game', (msg) => {
			if (!msg.running && msg.playerId === socket.id) 
			{
				end_game();
				return;
			}
			const field = msg.field;
			var cells 
			if (msg.playerId === socket.id) {
				cells = document.querySelectorAll('.game-bottle .cell');
				const heldPiece = msg.holdPiece
				const nextPiece = msg.nextPiece
				gameDraw.nextPieceDraw(nextPiece);
				gameDraw.heldPieceDraw(heldPiece);
				const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
			} 
			else 
			{
				let otherBoard = document.getElementById(msg.playerId);
				cells = otherBoard.querySelectorAll('.cell');
			}
			gameDraw.game(cells, field)
		});

		document.addEventListener("keydown", e => {
			socket.emit("keyDown", {key: e.key, roomCode: roomCode})
		})
		
		gameDraw.add_cells('.game-bottle', 200)
		// const game22 = document.querySelector('.secondary-games');
		// game22.innerHTML = '';
		gameDraw.add_cells('.next-piece', 60)
		gameDraw.add_cells('.held-piece', 30)
		if (name) 
			setUsername(name);
	}, [name]);
	
	function resetGame()
	{
		const single = document.createElement('div');
		const lines = document.querySelector('.lineClear')

		if(lines)
		{
			lines.textContent = 'Double'
			return
		}
		single.className = 'lineClear';
		single.textContent = 'Single';
		document.body.appendChild(single);
		// socket.emit("keyDown", {key: "Escape"})
		// setIsDisabled(false)
	}

	function scoreSave() {
		if (gameOver === true) {
			end_game();
			setGameOver(false);
		}
		console.log(gameOver);
		setIsDisabled(true);
		socket.emit("startGame", {roomCode: roomCode});
	
		if (name && score !== undefined) {
			localStorage.setItem("username", name);

			const scores = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith("Score")) {
					const value = localStorage.getItem(key);
					if (value) {
						const [savedName, savedScore] = value.split(" ");
						scores.push({ key, name: savedName, score: parseInt(savedScore) });
					}
				}
			}

			scores.push({ name, score });

			scores.sort((a, b) => b.score - a.score);
	
			const top5 = scores.slice(0, 5);
	
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith("Score")) {
					localStorage.removeItem(key);
					i = -1;
				}
			}
			top5.forEach((entry, index) => {
				localStorage.setItem(`Score${index + 1}`, `${entry.name} ${entry.score}`);
			});
		}
	}
	

	return (
		<div>
				{gameOver && <div className='game-Over'>
					Game Over
					<img className='game-over-image'src="/images/ripmario.gif"></img>
				</div>}
				<nav>
					<h1 className='room-info'>Room Code:{roomCode}      Username:{username}</h1>
				</nav>
			<div className="game-wrapper">
				<div className="held-piece">
					<span className="held-label">Held Piece</span>
				</div>
				<div className="game-bottle"></div>
				<div className="next-piece">
					<span className="held-label">Next Pieces</span>
				</div>
			</div>
			<div className='button-container'>
				<button onClick={scoreSave} className='buttons' disabled={isDisabled}>Start</button>
				<button onClick={resetGame} className='buttons'>Reset</button>
			</div>
			<div className='secondary-games'></div>
		</div>
	);
}
