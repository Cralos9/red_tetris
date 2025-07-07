'use client';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useEffect} from 'react';

export default function Options() {
	const [value, setValue] = useState(10);
	const [arrValue, setArrValue] = useState(5);
	
	useEffect(() => {
		const savedDAS = localStorage.getItem("DAS");
		if (savedDAS !== null) 
			setValue(Number(savedDAS));

		const savedARR = localStorage.getItem("ARR");
		if (savedARR !== null) 
			setArrValue(Number(savedARR));
	}, []);
  const router = useRouter();

  const maxDAS = 20;
  const maxARR = 10;

  function apply_options()
  {
	localStorage.setItem("DAS", value);
	localStorage.setItem("ARR", arrValue);
	router.push('/game');
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
			onChange={(e) => setArrValue(maxARR - Number(e.target.value))}
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
