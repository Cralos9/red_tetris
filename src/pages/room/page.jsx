'use client';
import Inputs from "./Inputs"
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import  gameDraw  from "./functions.js";
import {ACTIONS, SupportedKeys} from "../../../common.js";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux"
import { send } from "../../Store"
import { sendSocketMsg } from "../../socket"

export default function RoomPage() {
	const navigate = useNavigate()
	const dispatch = useDispatch();
	const params = useParams()
	const name = params.player_name
	const roomCode = params.room
	const [gameOver, setGameOver] = useState(false);
	const [allGamesOver, setAllGamesOver] = useState(true);
	var div;
	const [username, setUsername] = useState('');
	const [isDisabled, setIsDisabled] = useState(false);
	const [scores, setScores] = useState([]);
	const tick = useSelector((state) => state.game)
	const player = useSelector((state) => state.player)

	function end_game() {
	  setIsDisabled(false);
	  setGameOver(true);
	}

	function getOrdinal(n) {
		const s = ["th", "st", "nd", "rd"],
			  v = n % 100;
		return (n + (s[(v - 20) % 10] || s[v] || s[0]));
	}

	const bottleRef = useRef(null);
	const topRowRef = useRef(null);
	const startBtnRef = useRef(null);

	useEffect(() => {
		if(name)
			setUsername(name);

		const options = {
			actions: {
				[ACTIONS.MOVE_LEFT]: localStorage.getItem("left") ? [localStorage.getItem("left")] : ['ArrowLeft'],
				[ACTIONS.MOVE_RIGHT]: localStorage.getItem("right") ? [localStorage.getItem("right")] : ['ArrowRight'],
				[ACTIONS.ROTATE_LEFT]: localStorage.getItem("rotateLeft") ? [localStorage.getItem("rotateLeft")] : ['z'],
				[ACTIONS.ROTATE_RIGHT]: localStorage.getItem("rotateRight") ? [localStorage.getItem("rotateRight")] : ['ArrowUp', 'x'],
				[ACTIONS.HARD_DROP]: localStorage.getItem("hardDrop") ? [localStorage.getItem("hardDrop")] : [' '],
				[ACTIONS.SOFT_DROP]: localStorage.getItem("softDrop") ? [localStorage.getItem("softDrop")] : ['ArrowDown'],
				[ACTIONS.HOLD]: localStorage.getItem("holdPiece") ? [localStorage.getItem("holdPiece")] : ['c'],
			},
			ARR: parseInt(localStorage.getItem("ARR")) || 5,
			DAS: parseInt(localStorage.getItem("DAS")) || 10,
		};

		let msg = sendSocketMsg("joinRoom", { playerName: name, roomCode: roomCode, options:options, gameMode: "42" });
		dispatch(send(msg));

		gameDraw.add_cells('.next-piece', 60)
		gameDraw.add_cells('.held-piece', 30)
		gameDraw.add_cells('.top-row', 10);
		gameDraw.add_cells('.game-bottle', 200);
		return () => {
			dispatch(send(sendSocketMsg("leaveRoom", { roomCode: roomCode })))
		}
	}, [dispatch, name, roomCode]);


	useEffect(() => {
		if (!bottleRef.current || !topRowRef.current) return;
		if (!tick.field || !Array.isArray(tick.field)) return;

		const cells = bottleRef.current.querySelectorAll('.cell');
		const topRowCells = topRowRef.current.querySelectorAll('.cell');

		gameDraw.game(cells, tick.field, topRowCells, 1);
	}, [tick.field]);

// useEffect(() => {
		//socket.on('endGame', (msg) =>
		//{
		//	setScores(msg.leaderboard.reverse())

		//	setAllGamesOver(true);
		//})

		//socket.on('join', (msg) => 
		//{
		//	const startBtn = document.getElementById('Start');
		//	if (startBtn && socket.id === msg.roomOwner)
		//		startBtn.style.visibility = 'visible';
		//	var otherBoards = msg.playerIds
		//	var names = msg.playerNames
		//	for(var i = 0; i <= otherBoards.length; i++)
		//	{
		//		if(otherBoards[i] === socket.id || otherBoards[i] === undefined)
		//			continue;
		//		let otherBoard = document.getElementById(otherBoards[i]);
		//		if (!otherBoard) 
		//		{
		//			otherBoard = document.createElement('div');
		//			let nameLabel = document.createElement('span');
		//			nameLabel.className = 'held-label';
		//			nameLabel.textContent = names[i];
		//			nameLabel.id = name[i]
		//			otherBoard.className = 'secondary-game';
		//			otherBoard.id = otherBoards[i];
		//			otherBoard.appendChild(nameLabel);
		//			gameDraw.add_secondary_cells(otherBoard, 200);
		//			if(div)
		//			{
		//				div.appendChild(otherBoard)
		//				div = null;
		//			}
		//			else if((i - 1) % 2 == 0)
		//				document.querySelector('.secondary-games').appendChild(otherBoard);
		//			else
		//				document.querySelector('.secondary-games-right').appendChild(otherBoard);
		//		}
		//	}
		//})

		//socket.on('Error', (msg) =>
		//{
		//	navigate("/game")
		//	socket.disconnect();
		//});

		//socket.on('game', (msg) => {

		//	if (document.hidden)
		//		return;

		//	if (!msg.running && msg.playerId === socket.id) 
		//	{
		//		scoreSave(msg.playerScore.score);
		//		end_game();
		//		return;
		//	}
		//	const field = msg.field;
		//	var cells
		//	var own = 0;
		//	if (msg.playerId === socket.id)
		//	{
		//		own = 1;
		//		var j = 0;
		//		var gLines = 0;
		//		var score = document.getElementById('Score')
		//		score.textContent = msg.playerScore.score
		//		var level = document.getElementById('Level');
		//		level.textContent = msg.level
		//		setGameOver(false)
		//		cells = document.querySelectorAll('.game-bottle .cell');
		//		const heldPiece = msg.holdPiece
		//		const nextPiece = msg.nextPiece
		//		gameDraw.garbage_cell('.garbage-bar',msg.targetManager.garbage, msg.level);
		//		gameDraw.nextPieceDraw(nextPiece);
		//		gameDraw.heldPieceDraw(heldPiece);
		//		const lineClear = document.createElement('div');
		//		const combo = document.createElement('div');
		//		if (msg.linesCleared > 0) 
		//		{
		//			const existing = document.querySelector('.lineClear');
		//			if (existing) existing.remove();
		//			
		//			const existing2 = document.querySelector('.combo');
		//			if (existing2) existing2.remove();

		//			lineClear.className = 'lineClear';
		//			lineClear.textContent = gameDraw.get_lines(msg.linesCleared)
		//			const sound = gameDraw.get_audio(msg.linesCleared)
		//			void lineClear.offsetWidth;
		//			if(msg.combo != 1)
		//			{
		//				combo.className = 'combo';
		//				combo.textContent = "Combo x" + msg.combo;
		//			}
		//			document.body.appendChild(lineClear);
		//			document.body.appendChild(combo);
		//			setTimeout(() => {
		//				combo.remove();
		//				lineClear.remove();
		//			}, 1000);
		//			sound.play();
		//		}
		//	} 
		//	else 
		//	{
		//		let otherBoard = document.getElementById(msg.playerId);
		//		if(!otherBoard)
		//			return
		//		cells = otherBoard.querySelectorAll('.cell');
		//	}
		//	const topRow = document.querySelectorAll('.top-row .cell'); 
		//	gameDraw.game(cells, field, topRow, own)
		//});

		//document.addEventListener("keydown", handleKeyDown)
	
		//document.addEventListener("keyup", handleKeyUp)
	
		//
		//// const game22 = document.querySelector('.secondary-games');
		//// game22.innerHTML = '';
		//gameDraw.add_cells('.top-row', 10)
		//gameDraw.add_cells('.game-bottle', 200)
		//gameDraw.add_cells('.next-piece', 60)
		//gameDraw.add_cells('.held-piece', 30)
		//if (name) 
		//	setUsername(name);
		//
	// }, [name]);
	

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
		const msg = sendSocketMsg("startGame", { roomCode: roomCode })
		dispatch(send(msg))
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
	
			const top5 = scores.slice(0, 3);
	
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
	
	function homeButton()
	{
		navigate("/game");
	}

	return (
		<div>
			<div className="logButton-cont">
						<button onClick={homeButton} className="logButton">Home</button>
				</div>
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
				<nav >
					<h1 className='room-info'>Room Code:{roomCode}      Username:{username}</h1>
				</nav>
				<div className='main-layout'>
					<Inputs>
						<div className='secondary-games'></div>
						<div className="game-wrapper">
							<div className="held-piece">
								<span className="held-label">Held Piece</span>
							</div>
							<div className='garbage-bar'></div>
							<div className="game-bottle"ref={bottleRef}>
								<div className='top-row' ref={topRowRef}></div>
							</div>
							<div className="next-piece">
								<span className="held-label">Next Pieces</span>
							</div>
						</div>

						<div className='button-container'>
							<div className='scoreCard'>
							<span className='score'>Score</span>
							<span className='score' style={{color :'orange'}} id='Score'>{tick.score?.score ?? 0}</span>
							<span className='score'>Level</span>
							<span className='score' style={{color :'orange'}} id='Level'>{tick.level}</span>
							</div>
							<button onClick={startGame} className='buttons' disabled={isDisabled} 
								style={player.isOwner ? {visibility: 'visible'} : { visibility: 'hidden' }} id='Start'>Start</button>
						</div>
						<div className='secondary-games-right'></div>
					</Inputs>
				</div>
		</div>
	);
}
