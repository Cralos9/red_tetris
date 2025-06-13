'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from "../../../socket";

export default function RoomPage() {
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

	function nextPieceDraw(nextPiece)
	{
		if(nextPiece != 0)
		{
			const next = document.querySelector('.next-piece');
			const centerX = 2;
			var centerY = 2;
			const cells = next.querySelectorAll('.cell2');
			cells.forEach((cell) =>
			{
				cell.style.backgroundColor = getColor(0);
				cell.style.border = '0px solid #222';
			});
			nextPiece.forEach((piece) => {
				if (centerY > 8)
					return
				piece.forEach(([x, y]) => {
					const drawX = centerX + x;
					const drawY = centerY + y;
					const index = drawY * 6 + drawX;
					const cell = cells[index];
					if (cell)
					{
						cell.style.backgroundColor = getColor(1);
						cell.style.border = '2px solid #222';
					}
				});
				centerY += 3;
			});
		}
	}

	function add_cells(div, amount)
	{
		for (let i = 0; i < amount; i++) 
		{
			const cell = document.createElement('div');
			if (amount === 200)
				cell.className = 'cell';
			else
			cell.className = 'cell2';
			div.appendChild(cell);
		}
	}
	function getColor(value)
	{
		const colors = {
			0: 'transparent',
			1: '#b2ffff',
			2: '#d6a4ff',
			3: '#a3c4ff',
			4: '#ffd1a4',
			5: '#ffffb2',
			6: '#b2ffb2',       
			7: '#ffb2b2',
		};
		
		return colors[value];
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
					add_cells(otherBoard, 200);
					document.querySelector('.secondary-games').appendChild(otherBoard);
				}
			}
		})
		socket.on('game', (msg) => {
			const field = msg.field;
			if (!msg.running) {
				end_game();
				return;
			}
		
			if (msg.playerId === socket.id) {
				const cells = document.querySelectorAll('.game-bottle .cell');
				const heldPiece = msg.holdPiece
				const nextPiece = msg.nextPiece
				nextPieceDraw(nextPiece);
				if (heldPiece != 0)
				{
					const cells = held.querySelectorAll('.cell2');
					cells.forEach((cell) =>
					{
						cell.style.backgroundColor = getColor(0);
						cell.style.border = '0px solid #222';
					});
					const centerX = 2;
					const centerY = 2;
					heldPiece.forEach(([x, y]) => {
						const drawX = centerX + x;
						const drawY = centerY + y;
						const index = drawY * 6 + drawX;
						const cell = cells[index];
						cell.style.backgroundColor = getColor(1);
						cell.style.border = '2px solid #222';
					});
				}
				for (let y = 0; y < 20; y++) {
					for (let x = 0; x < 10; x++) 
					{
						const index = y * 10 + x;
						const value = field[y][x];
						if (value !== 8) 
						{
							cells[index].style.backgroundImage = 'none';
							cells[index].style.backgroundColor = getColor(value);
						} 
						else 
						{
							cells[index].style.backgroundImage = "url('/images/blue_virus.gif')";
							cells[index].style.backgroundSize = "cover";
						}
					}
				}
			} 
			else 
			{
				let otherBoard = document.getElementById(msg.playerId);
				const gameCells = otherBoard.querySelectorAll('.cell');
				for (let y = 0; y < 20; y++) {
					for (let x = 0; x < 10; x++) {
						const index = y * 10 + x;
						const value = field[y][x];
						if (gameCells[index]) {
							if (value !== 8) {
								gameCells[index].style.backgroundImage = 'none';
								gameCells[index].style.backgroundColor = getColor(value);
							} else {
								gameCells[index].style.backgroundImage = "url('/images/blue_virus.gif')";
								gameCells[index].style.backgroundSize = "cover";
							}
						}
					}
				}
			}
		});		
		document.addEventListener("keydown", e => {
			socket.emit("keyDown", {key: e.key, roomCode: roomCode})
		})
		const bottle = document.querySelector('.game-bottle');
		bottle.innerHTML = '';
		add_cells(bottle, 200)

		const game22 = document.querySelector('.secondary-games');
		game22.innerHTML = '';

		const next = document.querySelector('.next-piece');
		next.querySelectorAll('.cell').forEach(cell => cell.remove());		
		add_cells(next, 60)

		const held = document.querySelector('.held-piece');
		held.querySelectorAll('.cell').forEach(cell => cell.remove());
		add_cells(held, 30)

		if (name) 
			setUsername(name);
	}, [name]);
	
	function resetGame()
	{
		socket.emit("keyDown", {key: "Escape"})
		setIsDisabled(false)
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
				<div className="game-bottle">
				</div>
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
