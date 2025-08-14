import {COLORS} from "../../../../common.js";

const gifs = [
	"/images/blue_virus2.gif",
	"/images/yellow_virus2.gif",
	"/images/red_virus2.gif"
];

function game(cells, field, topRow)
{
	for (let y = 0; y < 21; y++) 
	{
		for (let x = 0; x < 10; x++) 
		{
			const index = y * 10 + x;
			const value = field[y][x];
			const cell = cells[index];
			console.log(y);
			if(y === 0 && value !== 8)
			{
				const top_cell = topRow[index];
				top_cell.style.backgroundColor = gameDraw.getColor(value);
				top_cell.style.backgroundImage = 'none';
				top_cell.removeAttribute('data-virus');
				if(value == 0)
				{
					top_cell.style.boxShadow = "none";
					top_cell.style.border = "none";
					continue;
				}
				top_cell.style.boxShadow = "inset 4px 4px 0 rgba(19, 15, 15, 0.34), inset -4px -4px 0 #44444459";
				top_cell.style.border = "2px solid #000000"
			}
			else if (value !== 8)
			{
				cell.style.backgroundImage = 'none';
				cell.style.backgroundColor = gameDraw.getColor(value);
				cell.removeAttribute('data-virus');
			} 
			else 
			{
				if (!cell.hasAttribute('data-virus')) 
				{
					const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
					cell.setAttribute('data-virus', randomGif);
				}
				const virusGif = cell.getAttribute('data-virus');
				cell.style.backgroundImage = `url('${virusGif}')`;
				cell.style.backgroundSize = "cover";
			}
		}
	}
}

function get_lines(linesCleared)
{
	const lines = {
		1: 'Single',
		2: 'Double',
		3: 'Triple',
		4: 'Home Run',
	}
	return(lines[linesCleared])
}

function add_secondary_cells(div,  amount)
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

	function garbage_cell(string, garbage)
	{
		const div = document.querySelector(string);
		Array.from(div.childNodes).forEach(child => {
			if (!(child.tagName === 'SPAN')) {
			div.removeChild(child);
			}
		});
		let glines = 0;
		for(let i = 0; i < garbage.length; i++)
		{
			glines += garbage[i].lines;
			if (glines > 20)
				return;
			for(let j = 0; j < garbage[i].lines; j++)
			{
				const cell = document.createElement('div');
				cell.className = 'cell';
				if(Date.now() - garbage[i].timer >= 4000)
					cell.style.backgroundColor = 'red';
				else if(Date.now() - garbage[i].timer >= 2000)
					cell.style.backgroundColor = 'yellow';
				else
					cell.style.backgroundColor = 'grey';
				div.appendChild(cell);
			}
		}
	}


	function add_cells(string,  amount)
	{
		const div = document.querySelector(string);
		
		Array.from(div.childNodes).forEach(child => {
			if (!(child.tagName === 'SPAN') && !(child.className === 'top-row')) {
			div.removeChild(child);
			}
		});
		for (let i = 0; i < amount; i++) 
		{
			const cell = document.createElement('div');
			cell.className = 'cell';
			if(amount == 10)
			{
				cell.style.border = "none";
				cell.style.boxShadow = "none";
			}
			div.appendChild(cell);
		}
	}

function getColor(value)
{
	const colors = {
		[COLORS.GHOST]: 'rgb(255, 255, 255, 0.8)',
		[COLORS.EMPTY]: 'transparent',
		[COLORS.BLUE]: 'rgb(0, 250, 255)',
		[COLORS.PURPLE]: 'rgb(192, 48, 255)',
		[COLORS.DARK_BLUE]: 'rgb(51, 153, 255)',
		[COLORS.ORANGE]: 'rgb(255, 153, 51)',
		[COLORS.YELLOW]: 'rgb(255, 255, 51)',
		[COLORS.GREEN]: 'rgb(51, 255, 51)',
		[COLORS.RED]: 'rgb(255, 51, 51)'
	};
	
	
	return colors[value];
}

function get_audio(linesCleared)
{
	const lines = {
		1:new Audio("/sounds/single.mp3"),
		2:new Audio("/sounds/double.mp3"),
		3:new Audio("/sounds/triple.mp3"),
		4:new Audio("/sounds/homerun.mp3"),
	}
	return(lines[linesCleared])
}

function heldPieceDraw(heldPiece)
{
	if (heldPiece != 0)
	{
		const held = document.querySelector('.held-piece');
		const cells = held.querySelectorAll('.cell');
		cells.forEach((cell) =>
		{
			cell.style.backgroundColor = getColor(0);
			// cell.style.border = '0px solid #222';
		});
		const centerX = 2;
		const centerY = 2;
		heldPiece.pattern.forEach(([x, y]) => {
			const drawX = centerX + x;
			const drawY = centerY + y;
			const index = drawY * 6 + drawX;
			const cell = cells[index];
			cell.style.backgroundColor = getColor(heldPiece.color);
			cell.style.border = '2px solid #222';
		});
	}
}

function nextPieceDraw(nextPiece)
{
	const next = document.querySelector('.next-piece');
	const centerX = 2;
	let centerY = 2;
	const cells = next.querySelectorAll('.cell');
	cells.forEach((cell) =>
	{
		cell.style.backgroundColor = getColor(0);
		// cell.style.border = '0px solid #222';
	});
	nextPiece.forEach((piece) => {
		if (centerY > 8)
			return;
		piece.pattern.forEach(([x, y]) => {
			const drawX = centerX + x;
			const drawY = centerY + y;
			const index = drawY * 6 + drawX;
			const cell = cells[index];
			if (cell)
			{
				cell.style.backgroundColor = getColor(piece.color);
				cell.style.border = '2px solid #222';
			}
		});
		centerY += 3;
	});
}

const gameDraw = {
	heldPieceDraw,
	nextPieceDraw,
	getColor,
	add_cells,
	add_secondary_cells,
	game,
	get_lines,
	get_audio,
	garbage_cell,
};

export default gameDraw;
