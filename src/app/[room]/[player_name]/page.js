'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { socket } from "../../../socket";
import  gameDraw  from "./functions";
import {ACTIONS} from "../../../../common.js";

export default function RoomPage() {
	const params = useParams();
	const roomCode = params.room;
	const [gameOver, setGameOver] = useState(false);
	const [allGamesOver, setAllGamesOver] = useState(true);

	var div;
	const name = params.player_name;
	const [username, setUsername] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	const [scores, setScores] = useState([]);

	function end_game() {
	  setIsDisabled(false);
	  setGameOver(true);
	}

	function getOrdinal(n) {
		const s = ["th", "st", "nd", "rd"],
			  v = n % 100;
		return (n + (s[(v - 20) % 10] || s[v] || s[0]));
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
			if(!board)
				return
			console.log(board);
			div = board.parentElement;
			if(board)
				board.remove();
		});

		return function cleanup() {
			socket.off("connect", handleConnect);
		};
	}, []);

	useEffect(() => {

		const options = {
			actions: {
			  [ACTIONS.MOVE_LEFT]: localStorage.getItem("left") ? [localStorage.getItem("left")] : ['ArrowLeft'],
			  [ACTIONS.MOVE_RIGHT]: localStorage.getItem("right") ? [localStorage.getItem("right")] : ['ArrowRight'],
			  [ACTIONS.ROTATE_LEFT]: localStorage.getItem("rotateLeft") ? [localStorage.getItem("rotateLeft")] : ['z'],
			  [ACTIONS.ROTATE_RIGHT]: localStorage.getItem("rotateRight") ? [localStorage.getItem("rotateRight")] : ['x'],
			  [ACTIONS.HARD_DROP]: localStorage.getItem("hardDrop") ? [localStorage.getItem("hardDrop")] : [' '],
			  [ACTIONS.SOFT_DROP]: localStorage.getItem("softDrop") ? [localStorage.getItem("softDrop")] : ['ArrowDown'],
			  [ACTIONS.HOLD]: localStorage.getItem("holdPiece") ? [localStorage.getItem("holdPiece")] : ['c'],
			},
			ARR: parseInt(localStorage.getItem("ARR")) || 5,
			DAS: parseInt(localStorage.getItem("DAS")) || 10,
		  };
		console.log("options: ", options);
		socket.emit('joinRoom', {playerName: name, roomCode: roomCode, options: options})


		socket.on('endGame', (msg) =>
		{
			console.log("Msg: ", msg)
			setScores(msg.leaderboard.reverse())
			console.log("Scores: " ,scores);
			setAllGamesOver(true);
		})

		socket.on('join', (msg) => 
		{
			const startBtn = document.getElementById('Start');
			console.log(msg)
			if (startBtn && socket.id === msg.roomOwner)
				startBtn.style.visibility = 'visible';
			var otherBoards = msg.playerIds
			var names = msg.playerNames
			console.log("ID: " ,msg.playerIds)
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
					console.log("i: %i   i%2 : %i", i, i%2);
					if(div)
					{
						console.log("div: ", div)
						div.appendChild(otherBoard)
						div = null;
					}
					else if((i - 1) % 2 == 0)
						document.querySelector('.secondary-games').appendChild(otherBoard);
					else
						document.querySelector('.secondary-games-right').appendChild(otherBoard);
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
			var cells 
			if (msg.playerId === socket.id) 
			{
				var j = 0;
				var gLines = 0;
				var score = document.getElementById('Score')
				score.textContent = msg.playerScore.score
				var level = document.getElementById('Level');
				level.textContent = msg.level
				setGameOver(false)
				cells = document.querySelectorAll('.game-bottle .cell');
				const heldPiece = msg.holdPiece
				const nextPiece = msg.nextPiece
				gameDraw.garbage_cell('.garbage-bar',msg.targetManager.garbage);
				gameDraw.nextPieceDraw(nextPiece);
				gameDraw.heldPieceDraw(heldPiece);
				const lineClear = document.createElement('div');
				const combo = document.createElement('div');
				if (msg.linesCleared > 0) 
				{
					const existing = document.querySelector('.lineClear');
					if (existing) existing.remove();
					
					const existing2 = document.querySelector('.combo');
					if (existing2) existing2.remove();

					lineClear.className = 'lineClear';
					lineClear.textContent = gameDraw.get_lines(msg.linesCleared)
					const sound = gameDraw.get_audio(msg.linesCleared)
					void lineClear.offsetWidth;
					if(msg.combo != 1)
					{
						combo.className = 'combo';
						combo.textContent = "Combo x" + msg.combo;
					}
					document.body.appendChild(lineClear);
					document.body.appendChild(combo);
					setTimeout(() => {
						combo.remove();
						lineClear.remove();
					}, 1000);
					sound.play();
				}
			} 
			else 
			{
				let otherBoard = document.getElementById(msg.playerId);
				if(!otherBoard)
					return
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

	function startGame() 
	{
		let time = 3;
	  
		if (gameOver === true) {
		  end_game();
		  setGameOver(false);
		}
		if(allGamesOver == false)
			return;
		setAllGamesOver(false);
		gameDraw.add_cells('.held-piece', 30)
		console.log(gameOver);
		setIsDisabled(true);
	  
		// ************ Countdown Code ******************
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
		// ***********************************************
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

					{allGamesOver && <div style={{width: '30vw'}} className='usercard'>
						Leaderboard
				
{/* 						
						 //// For Object ///
						 {Object.entries(scores).map(([key, value], idx) => (
							<div key={key}>
							<h3 style={{ color: 'white' }}>{key} {value}</h3>
							{idx !== Object.entries(scores).length - 1 && <hr style={{ color: 'white' }} />}
							</div>
							))}  */}

						{ 	/* /// For array// */
						scores.map((s, idx) => (
							<div key={idx}>
							<h3 style={{ color: 'white' }}>{getOrdinal(idx + 1)} {s.playerName}</h3>
							{idx !== scores.length - 1 && <hr style={{color: 'white'}} />}
							</div>
						))
						}
					</div>}
					{/*<img className='game-over-image'src="/images/ripmario.gif"></img> */}
				</div>}
				<nav>
					<h1 className='room-info'>Room Code:{roomCode}      Username:{username}</h1>
				</nav>
				<div className='main-layout'>
						<div className='secondary-games'></div>
						<div className="game-wrapper">
							<div className="held-piece">
							<span className="held-label">Held Piece</span>
							</div>
							<div className='garbage-bar'></div>
							<div className="game-bottle"></div>
							<div className="next-piece">
							<span className="held-label">Next Pieces</span>
							</div>
						</div>

						<div className='button-container'>
							<div className='scoreCard'>
							<span className='score'>Score</span>
							<span className='score' style={{color :'orange'}} id='Score'>0</span>
							<span className='score'>Level</span>
							<span className='score' style={{color :'orange'}} id='Level'>0</span>
							</div>
							<button onClick={startGame} className='buttons' disabled={isDisabled} style={{ visibility: 'hidden' }} id='Start'>Start</button>
						</div>

					<div className='secondary-games-right'></div>
				</div>
		</div>
	);
}
