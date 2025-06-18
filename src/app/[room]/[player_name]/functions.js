
const gifs = [
	"/images/blue_virus2.gif",
	"/images/yellow_virus2.gif",
	"/images/red_virus2.gif"
];

function game(cells, field)
{
	for (let y = 0; y < 20; y++) 
		{
			for (let x = 0; x < 10; x++) 
			{
			  const index = y * 10 + x;
			  const value = field[y][x];
			  const cell = cells[index];
		  
				if (value !== 8)
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

	function add_cells(string,  amount)
	{
		const div = document.querySelector(string);
		div.innerHTML = '';
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
	"-1": '#ffffffCC',
	0: 'transparent',
	1: '#b2ffff',
	2: '#d6a4ff',
	3: '#a3c4ff',
	4: '#ffd1a4',
	5: '#ffffb2',
	6: '#b2ffb2',       
	7: '#ffb2b2'
	};
	
	return colors[value];
}

function heldPieceDraw(heldPiece)
{
	if (heldPiece != 0)
	{
		const held = document.querySelector('.held-piece');
		const cells = held.querySelectorAll('.cell2');
		cells.forEach((cell) =>
		{
			cell.style.backgroundColor = getColor(0);
			cell.style.border = '0px solid #222';
		});
		const centerX = 2;
		const centerY = 2;
		heldPiece.hold.forEach(([x, y]) => {
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
	const cells = next.querySelectorAll('.cell2');
	cells.forEach((cell) =>
	{
		cell.style.backgroundColor = getColor(0);
		cell.style.border = '0px solid #222';
	});
	nextPiece.forEach((piece) => {
		if (centerY > 8)
			return;
		piece.piece.forEach(([x, y]) => {
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
	get_lines
};

export default gameDraw;
