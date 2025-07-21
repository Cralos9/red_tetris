'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from "../../../socket";
import  gameDraw  from "./functions";
import {Actions} from "../../../../server/Game/gameParams"

export default function RoomPage() {
	const params = useParams();
	const roomCode = params.room;
	const [gameOver, setGameOver] = useState(false);

	const name = params.player_name;
	const [username, setUsername] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	

	function end_game() {
	  setIsDisabled(false);
	  setGameOver(true);
	}

	useEffect(() => {
		socket.connect();
	  
		socket.on('ping-check', () => {
			socket.emit('pong-check')
		})
		function handleConnect() {
			console.log("Connection Accepted")
			// socket.emit('disconnection', {roomCode: roomCode})
		}

		socket.on("connect", handleConnect);
		
		socket.on('Owner', (msg) =>
		{
			const startBtn = document.getElementById('Start');
			if (startBtn && socket.id === msg.owner)
				startBtn.style.visibility = 'visible';
		});

		socket.on("boardRemove", (msg) =>
		{
			console.log("Board Remove Id: " ,msg.id)
			var board = document.getElementById(msg.id)
			if(board)
				board.remove();
		});

		return function cleanup() {
			socket.off("connect", handleConnect);
		};
	}, []);

	useEffect(() => {

		const options = {
			actions : {
				[Actions.MOVE_LEFT]: [localStorage.getItem("left")] || ['ArrowLeft'],
				[Actions.MOVE_RIGHT]: [localStorage.getItem("right")] || ['ArrowRight'],
				[Actions.ROTATE_LEFT]: [localStorage.getItem("rotateLeft")] || ['z'],
				[Actions.ROTATE_RIGHT]: [localStorage.getItem("rotateRight")] || ['x'],
				[Actions.HARD_DROP]: [localStorage.getItem("hardDrop")] || [' '],
				[Actions.SOFT_DROP]: [localStorage.getItem("softDrop")] || ['ArrowDown'],
				[Actions.HOLD] : [localStorage.getItem("holdPiece")] || ['c'],
			},
			ARR: localStorage.getItem("ARR") ||  5,
			DAS: localStorage.getItem("DAS")  || 10,
		}
		socket.emit('joinRoom', {playerName: name, roomCode: roomCode, options: options})

		socket.on('join', (msg) => 
		{
			const startBtn = document.getElementById('Start');
			console.log(msg)
			if (startBtn && socket.id === msg.roomOwner)
				startBtn.style.visibility = 'visible';
			var otherBoards = msg.playerIds
			var names = msg.playerNames
			console.log(names)
			for(var i = 0; i <= otherBoards.length; i++)
			{
				if(otherBoards[i] === socket.id || otherBoards[i] === undefined)
					continue;
				let otherBoard = document.getElementById(otherBoards[i]);
				if (!otherBoard) 
				{
					otherBoard = document.createElement('div');
					let nameLabel = document.createElement('span');
					nameLabel.className = 'held-label';
					nameLabel.textContent = names[i];
					nameLabel.id = name[i]
					otherBoard.className = 'secondary-game';
					otherBoard.id = otherBoards[i];
					otherBoard.appendChild(nameLabel);
					gameDraw.add_secondary_cells(otherBoard, 200);
					document.querySelector('.secondary-games').appendChild(otherBoard);
				}
			}
		})
		socket.on('game', (msg) => {
			if (!msg.running && msg.playerId === socket.id) 
			{
				scoreSave(msg.playerScore.score);
				end_game();
				return;
			}
			const field = msg.field;
			//console.log("Score:", msg.playerScore)
			var cells 
			if (msg.playerId === socket.id) 
			{
				var score = document.getElementById('Score')
				score.textContent = msg.playerScore.score
				setGameOver(false)
				cells = document.querySelectorAll('.game-bottle .cell');
				const heldPiece = msg.holdPiece
				const nextPiece = msg.nextPiece
				gameDraw.nextPieceDraw(nextPiece);
				gameDraw.heldPieceDraw(heldPiece);
				const lineClear = document.createElement('div');
				if (msg.linesCleared > 0) 
				{
					console.log(msg.linesCleared)
					const existing = document.querySelector('.lineClear');
					if (existing) existing.remove();
				
					lineClear.className = 'lineClear';
					lineClear.textContent = gameDraw.get_lines(msg.linesCleared)
					const sound = gameDraw.get_audio(msg.linesCleared)
					void lineClear.offsetWidth;
					document.body.appendChild(lineClear);
					setTimeout(() => {
						lineClear.remove();
					}, 1000);
					sound.play();
				}
			} 
			else 
			{
				let otherBoard = document.getElementById(msg.playerId);
				cells = otherBoard.querySelectorAll('.cell');
			}
			gameDraw.game(cells, field)
		});

		async function handleBeforeUnload() {
			if (socket && socket.connected) {
				await new Promise((resolve) => {
					socket.emit('disconnection', { roomCode: roomCode }, resolve);
				});
				if (otherBoards && otherBoards.length) {
					for (let i = 0; i < otherBoards.length; i++) {
						const otherBoard = document.getElementById(otherBoards[i]);
						if (otherBoard) otherBoard.remove();
					}
				}
				socket.disconnect();
			}
		}
		
		// window.addEventListener('beforeunload', handleBeforeUnload);

		document.addEventListener("keydown", e => {
			socket.emit("keyDown", {key: e.key, roomCode: roomCode})
		})
		document.addEventListener("keyup", e => {
			socket.emit("keyUp", {key: e.key, roomCode: roomCode})
		})
		
		// const game22 = document.querySelector('.secondary-games');
		// game22.innerHTML = '';
		gameDraw.add_cells('.game-bottle', 200)
		gameDraw.add_cells('.next-piece', 60)
		gameDraw.add_cells('.held-piece', 30)
		if (name) 
			setUsername(name);
	}, [name]);
	
	function resetGame()
	{
		// socket.emit("keyDown", {key: "Escape"})
		// setIsDisabled(false)
	}

	function startGame() {
		let time = 3;
	  
		if (gameOver === true) {
		  end_game();
		  setGameOver(false);
		}
	  
		console.log(gameOver);
		setIsDisabled(true);
	  
		// var countdown = document.createElement('div');
		// countdown.className = 'countdown';
		// document.body.appendChild(countdown)
		// const intervalId = setInterval(() => 
		// {
		// 	countdown.textContent = time;
		// 	time--;
		// 	console.log('Countdown:', time);
		// 	if (time < 0) {
		// 		clearInterval(intervalId);
		// 		document.body.removeChild(countdown)
		// 		socket.emit("startGame", { roomCode: roomCode });
		// }
		// }, 1000);
		// if (time == 0)

		socket.emit("startGame", {roomCode: roomCode});
	

	}

	function scoreSave(score)
	{
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
				<div className='scoreCard'>
					<span className='score'>Score</span>
					<span className='score' id ='Score'>0</span>
					<span className='score'>Level</span>
					<span className='score' id ='level'>0</span>
				</div>
				<button onClick={startGame} className='buttons' disabled={isDisabled} style={{visibility: 'hidden'}} id='Start'>Start</button>
				<button onClick={resetGame} className='buttons'>Reset</button>
			</div>
			<div className='secondary-games'></div>
		</div>
	);
}
