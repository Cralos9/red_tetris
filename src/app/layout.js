import './cssFiles/globals.css';
import './cssFiles/buttons.css';
import './cssFiles/board.css'

export const metadata = {
	title: 'Dr Tetris',
};

export default function Page({ children }) {

	return (
		<html lang="en">
			<head>
				<link
					href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap"
					rel="stylesheet"
				/>
				
			</head>
			<body>
				<div className="header">
					
					<h1 className="title">Dr.Tetris</h1>
				</div>
				<img className="shroom-img" src="/images/shroom.png"></img>
				<img className="piranha-img" src="/images/piranha.png" alt="Piranha" />
				<img className="mario-img" src="/images/images.png" alt="Mario" />
				{/* <img  src="/images/gomba_tower.gif" alt="Dario" /> */}
				{/* <img className="virus-img" src="/images/Virus.png" alt="Virus" /> */}
				{children}
			</body>
		</html>
	);
}
