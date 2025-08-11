
/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import gameDraw from "./functions";

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
    expect(cells[14].style.backgroundColor).toBe("rgb(255, 51, 51)");
    expect(cells[15].style.backgroundColor).toBe("rgb(255, 51, 51)");
    expect(cells[20].style.backgroundColor).toBe("rgb(255, 51, 51)");
    expect(cells[21].style.backgroundColor).toBe("rgb(255, 51, 51)");

  });

  test("does nothing when heldPiece is 0", () => 
    {
    const cellsBefore = [...document.querySelectorAll(".cell")].map(c => c.style.backgroundColor);
    gameDraw.heldPieceDraw(0);
    const cellsAfter = [...document.querySelectorAll(".cell")].map(c => c.style.backgroundColor);
    expect(cellsBefore).toEqual(cellsAfter);
  });
});
