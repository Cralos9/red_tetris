
/**
 * @jest-environment jsdom
 */
import {COLORS} from "../../../../common.js";
import { describe, jest } from '@jest/globals';
import gameDraw from "./functions";


test('clear Lines', () =>{
	const line = gameDraw.get_lines(1);
	expect(line).toBe('Single');
})


describe('game', () => {
	let cells;
	let field;

	beforeEach(() => {
		cells = Array.from({ length: 200 }, () => document.createElement('div'));
		field = Array.from({ length: 20 }, () => Array(10).fill(0));
		field[0][0] = 8;
	});

	test('sets normal cell color and clears virus', () => {
		gameDraw.game(cells, field);

		expect(cells[0].getAttribute('data-virus')).toBeTruthy();
		expect(cells[0].style.backgroundImage).toContain('url');

		const normalCell = cells[1];
		expect(normalCell.style.backgroundColor).toBe('transparent');
		expect(normalCell.style.backgroundImage).toBe('none');
		expect(normalCell.hasAttribute('data-virus')).toBe(false);
	});

	test('virus keeps same gif after rerun', () => {
		gameDraw.game(cells, field);
		const gifFirstRun = cells[0].getAttribute('data-virus');
		gameDraw.game(cells, field);
		expect(cells[0].getAttribute('data-virus')).toBe(gifFirstRun);
	});
});


describe('garbage_cell', () => {
	let container;

	beforeEach(() => {
		document.body.innerHTML = `<div id="container"><span>keep me</span><p>remove me</p></div>`;
		container = document.querySelector('#container');
	});

	test('removes non-SPAN children', () => {
		gameDraw.garbage_cell('#container', []);
		expect(container.querySelector('p')).toBeNull();
		expect(container.querySelector('span')).not.toBeNull();
	});

	test('appends cells with correct colors', () => {
		const fixedNow = 10_000;
		jest.spyOn(Date, 'now').mockReturnValue(fixedNow);

		const garbage = [
			{ lines: 1, timer: fixedNow - 1000 },
			{ lines: 1, timer: fixedNow - 3000 },
			{ lines: 1, timer: fixedNow - 5000 }
		];

		gameDraw.garbage_cell('#container', garbage);

		const cells = container.querySelectorAll('.cell');
		expect(cells).toHaveLength(3);
		expect(cells[0].style.backgroundColor).toBe('grey');
		expect(cells[1].style.backgroundColor).toBe('yellow');
		expect(cells[2].style.backgroundColor).toBe('red');

		Date.now.mockRestore();
	});

	test('stops adding cells if glines > 20', () => {
		const garbage = [
			{ lines: 10, timer: 0 },
			{ lines: 15, timer: 0 }
		];

		gameDraw.garbage_cell('#container', garbage);
		const cells = container.querySelectorAll('.cell');
		expect(cells).toHaveLength(10); // second set should not be added
	});
});

describe('add_cells', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div id="container">
				<span>Keep me</span>
				<p>Remove me</p>
			</div>
		`;
	});

	test('removes non-SPAN children and adds cells', () => {
		gameDraw.add_cells('#container', 3);

		const container = document.querySelector('#container');
		const children = container.childNodes;

		expect(children[0].tagName).toBe('SPAN');
		expect(container.querySelectorAll('.cell')).toHaveLength(3);
		expect(container.querySelector('p')).toBeNull();
	});

	test('adds .cell2 elements when amount != 200', () => {
		const div = document.createElement('div');
		div.id = 'container';
		document.body.appendChild(div);

		gameDraw.add_secondary_cells(div, 3);

		expect(div.querySelectorAll('.cell2')).toHaveLength(3);
		expect(div.querySelectorAll('.cell')).toHaveLength(0);
	});

	test('adds .cell elements when amount == 200', () => {
		const div = document.createElement('div');
		document.body.appendChild(div);

		gameDraw.add_secondary_cells(div, 200);

		expect(div.querySelectorAll('.cell')).toHaveLength(200);
		expect(div.querySelectorAll('.cell2')).toHaveLength(0);
	});

	
});

describe("heldPieceDraw", () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div class="held-piece">
				${'<div class="cell"></div>'.repeat(36)}
			</div>
		`;
	});

	test("draws the held piece correctly", () => {
		const heldPiece = {
			color: 7,
			pattern: [
				[0, 0],
				[1, 0],
				[0, 1],
				[1, 1],
			]
		};

		gameDraw.heldPieceDraw(heldPiece);

		const cells = document.querySelectorAll(".cell");
		expect(cells[14].style.backgroundColor).toBe(gameDraw.getColor(COLORS.RED));
		expect(cells[15].style.backgroundColor).toBe(gameDraw.getColor(COLORS.RED));
		expect(cells[20].style.backgroundColor).toBe(gameDraw.getColor(COLORS.RED));
		expect(cells[21].style.backgroundColor).toBe(gameDraw.getColor(COLORS.RED));

	});

	test("does nothing when heldPiece is 0", () => 
		{
		const cellsBefore = [...document.querySelectorAll(".cell")].map(c => c.style.backgroundColor);
		gameDraw.heldPieceDraw(0);
		const cellsAfter = [...document.querySelectorAll(".cell")].map(c => c.style.backgroundColor);
		expect(cellsBefore).toEqual(cellsAfter);
	});
});
