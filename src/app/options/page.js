'use client';
import { useState } from "react";

export default function Options() {
  const [value, setValue] = useState(10);
  const [arrValue, setarrValue] = useState(5);

  const maxDAS = 20;
  const maxARR = 10;

  function apply_options()
  {
    localStorage.setItem("DAS", value)
    localStorage.setItem("ARR", arrValue)
  }


  return (
    <div className="main-container">
      <div className="usercard">
        <button>
          <span>DAS</span>
          <input
            type="range"
            min="0"
            max={maxDAS}
            value={maxDAS - value}
            onChange={(e) => setValue(maxDAS - Number(e.target.value))}
          />
          <p>{value} Frames</p>
        </button>

        <button>
          <span>ARR</span>
          <input
            type="range"
            min="0"
            max={maxARR}
            value={maxARR - arrValue}
            onChange={(e) => setarrValue(maxARR - Number(e.target.value))}
          />
          <p>{arrValue} Frames</p>
        </button>
        <div className="button-row">
        <button className="button2" onClick={apply_options}>Apply</button>
        <button className="button2">Reset</button>
        </div>
      </div>
    </div>
  );
}
