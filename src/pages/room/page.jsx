'use client';
import Inputs from "./Inputs"
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react';
import  gameDraw  from "./functions.js";
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux"
import { opponents, send, setName, setRoom, setOwner, clearGame, clearJoiners } from "../../Store"
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
	const opponents = useSelector((state) => state.opponents)
	const joiners = useSelector((state) => state.join)
	const player = useSelector((state) => state.player)
	const endGame = useSelector((state) => state.game)
	const boardRem = useSelector((state) => state.game)

	function end_game() {
	  setIsDisabled(false);
	  setGameOver(true);
	  if(tick.score)
	  	scoreSave(tick.score.score)
	}

	function getOrdinal(n) {
		const s = ["th", "st", "nd", "rd"],
			  v = n % 100;
		return (n + (s[(v - 20) % 10] || s[v] || s[0]));
	}

	const bottleRef = useRef(null);
	const topRowRef = useRef(null);
	const startButtonRef = useRef(null);

	useEffect(() => {
		if(name)
			setUsername(name);

		const options = {
			ARR: parseInt(localStorage.getItem("ARR")) || 5,
			DAS: parseInt(localStorage.getItem("DAS")) || 10,
		};
		let msg = sendSocketMsg("joinRoom", { playerName: name, roomCode: roomCode, options:options, gameMode: player.room.gameMode});
		dispatch(send(msg));

		gameDraw.add_cells('.next-piece', 60)
		gameDraw.add_cells('.held-piece', 30)
		gameDraw.add_cells('.top-row', 10);
		gameDraw.add_cells('.game-bottle', 200);
		const startBtn = startButtonRef;
		// if (startBtn)
		// 	startBtn.style.visibility = 'visible';
		return () => {
			dispatch(send(sendSocketMsg("leaveRoom", { roomCode: roomCode })))
			dispatch(clearGame())
			dispatch(setOwner(false))
			dispatch(clearJoiners())
			setGameOver(false);
			setAllGamesOver(false);
		}
	}, [dispatch, name, roomCode]);


	useEffect(() =>
	{
		if(!joiners.playerIds) return;
		var otherBoards = joiners.playerIds
		var names = joiners.playerNames
		for(var i = 0; i <= otherBoards.length; i++)
		{
			if(otherBoards[i] === player.id || otherBoards[i] === undefined)
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
				if(div)
				{
					div.appendChild(otherBoard)
					div = null;
				}
				else if((i - 1) % 2 == 0)
					document.querySelector('.secondary-games').appendChild(otherBoard);
				else
					document.querySelector('.secondary-games-right').appendChild(otherBoard);
			}
		}
	}, [joiners]);

	useEffect(() => {
		if (!bottleRef.current || !topRowRef.current) return;
		if (!tick.field || !Array.isArray(tick.field)) return;

		const cells = bottleRef.current.querySelectorAll('.cell');
		const topRowCells = topRowRef.current.querySelectorAll('.cell');

		var own = 1;
		var j = 0;
		var gLines = 0;
		setGameOver(false)
		const holdPiece = tick.holdPiece
		const nextPiece = tick.nextPiece
		gameDraw.garbage_cell('.garbage-bar',tick.targetManager.garbage, tick.level);
		gameDraw.nextPieceDraw(nextPiece);
		gameDraw.heldPieceDraw(holdPiece);
		const lineClear = document.createElement('div');
		const combo = document.createElement('div');
		if (tick.linesCleared > 0) 
		{
			const existing = document.querySelector('.lineClear');
			if (existing) existing.remove();
			
			const existing2 = document.querySelector('.combo');
			if (existing2) existing2.remove();
			lineClear.className = 'lineClear';
			lineClear.textContent = gameDraw.get_lines(tick.linesCleared)
			const sound = gameDraw.get_audio(tick.linesCleared)
			void lineClear.offsetWidth;
			if(tick.combo != 1)
			{
				combo.className = 'combo';
				combo.textContent = "Combo x" + tick.combo;
			}
			document.body.appendChild(lineClear);
			document.body.appendChild(combo);
			setTimeout(() => {
				combo.remove();
				lineClear.remove();
			}, 1000);
			sound.play();
		}
		gameDraw.game(cells, tick.field, topRowCells, own);
	}, [tick.field]);

	useEffect(() =>
	{
		var own = 0;
		let otherBoard = document.getElementById(opponents.id);
		if(!otherBoard)
			return
		const cells = otherBoard.querySelectorAll('.cell');
		const topRowCells = topRowRef.current.querySelectorAll('.cell');
		gameDraw.game(cells, opponents.field, topRowCells, own);
	}, [opponents.field]);

	useEffect(() =>
	{
		if(!endGame.leaderboard) return;
		setScores(endGame.leaderboard)
		setAllGamesOver(true);
		end_game();
	}, [endGame.leaderboard, allGamesOver])

	useEffect(() =>
	{
		if(!boardRem.id) return;
		var board = document.getElementById(boardRem.id)
		if(!board)
			return
		div = board.parentElement;
		if(board)
			board.remove();
	}, [boardRem.id]);


	function startGame() 
	{
		let time = 3;
		if(allGamesOver == false)
			return;
		setAllGamesOver(false);
		gameDraw.add_cells('.held-piece', 30)
		setIsDisabled(true);
		
		const msg = sendSocketMsg("startGame", { roomCode: roomCode })
		dispatch(send(msg))
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
	
			const top3 = scores.slice(0, 3);
			
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith("Score")) {
					localStorage.removeItem(key);
					i = -1;
				}
			}
			top3.forEach((entry, index) => {
				console.log(index, entry.name, entry.score);
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
					<Inputs roomCode={roomCode} />
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
							<button onClick={startGame} ref={startButtonRef} className='buttons' disabled={isDisabled} 
								style={player.isOwner ? {visibility: 'visible'} : { visibility: 'hidden' }} id='Start'>Start</button>
						</div>
						<div className='secondary-games-right'></div>
				</div>
		</div>
	);
}
