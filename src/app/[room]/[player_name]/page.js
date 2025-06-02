'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from "../../../socket";

export default function RoomPage() {
	const params = useParams();
	const roomCode = params.room;
	const name = params.player_name;
	const score = 30000;
	const game_amount = 3;
	const [username, setUsername] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);

	function getColor(value)
	{
		const colors = {
			0: 'transparent',
			1: 'cyan',
			2: 'purple',
			3: 'blue',
			4: 'orange',
			5: 'yellow',
			6: 'green',
			7: 'red',

		};
		return colors[value];
	}
	useEffect(() => {
		socket.on("connect", () => {
			console.log("Connected to the websocket")
			})

		socket.on('action', (msg) => 
		{
			const cells = document.querySelectorAll('.game-bottle .cell');
			const field = msg.field;
			field[9][9] = 8;

			const secondaryGames = document.querySelectorAll('.secondary-game');

			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					const index = y * 10 + x;
					const value = field[y][x];

					if (value !== 8) {
						cells[index].style.backgroundImage = 'none';
						cells[index].style.backgroundColor = getColor(value);
					} else {
						cells[index].style.backgroundImage = "url('/images/blue_virus.gif')";
						cells[index].style.backgroundSize = "cover";
					}
					secondaryGames.forEach(game => {
						const gameCells = game.querySelectorAll('.cell');
						if (gameCells[index]) {
							if (value !== 8) {
								gameCells[index].style.backgroundImage = 'none';
								gameCells[index].style.backgroundColor = getColor(value);
							} else {
								gameCells[index].style.backgroundImage = "url('/images/blue_virus.gif')";
								gameCells[index].style.backgroundSize = "cover";
							}
						}
					});
				}
			}
		})

		document.addEventListener("keydown", e => {
				socket.emit("action", {key: e.key})
		})

			const bottle = document.querySelector('.game-bottle');
			bottle.innerHTML = '';
			for (let i = 0; i < 200; i++) {
				const cell = document.createElement('div');
				cell.className = 'cell';
				bottle.appendChild(cell);
			}
		
			const game22 = document.querySelector('.secondary-games');
			game22.innerHTML = '';
			for (let i = 1; i < game_amount; i++)
			{
				const games = document.createElement('div');
				games.className = 'secondary-game'
				games.innerHTML = '';
				for (let i = 0; i < 200; i++) {
					const cell = document.createElement('div');
					cell.className = 'cell';
					games.appendChild(cell);
			}
				game22.appendChild(games)
			}
			
			// const game2 = document.querySelector('.secondary-game');
			// game2.innerHTML = '';
			// for (let i = 0; i < 200; i++) {
			//   const cell = document.createElement('div');
			//   cell.className = 'cell';
			//   game2.appendChild(cell);
			// }

			const next = document.querySelector('.next-piece');
			next.querySelectorAll('.cell').forEach(cell => cell.remove());
					
			for (let i = 0; i < 60; i++) {
				const cell = document.createElement('div');
				cell.className = 'cell';
				next.appendChild(cell);
			}

			const held = document.querySelector('.held-piece');
			held.querySelectorAll('.cell').forEach(cell => cell.remove());
		
			for (let i = 0; i < 36; i++) {
				const cell = document.createElement('div');
				cell.className = 'cell';
				held.appendChild(cell);
			}
			if (name) {
				setUsername(name);
			}
	}, [name]);
	
	function scoreSave() {
		setIsDisabled(true);
		socket.emit("action", {key: "start"});
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
				<nav>
					<h1 className='room-info'>Room Code:{roomCode}      Username:{username}</h1>
				</nav>
			<div className="game-wrapper">
				<div className="held-piece">
					<span className="held-label">Held Piece</span>
				</div>
				<div className="next-piece">
					<span className="held-label">Next Pieces</span>
				</div>
				<div className="game-bottle">
				</div>
			</div>
			<div className='secondary-games'>
			</div>
			<div className='button-container'>
				<button onClick={scoreSave} className='buttons' disabled={isDisabled}>Start</button>
				<button className='buttons'>Reset</button>
			</div>
		</div>
	);
}
