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

	function keysPush()
	{
		router.push('options/keys')
	}

	function reset_options()
	{
		setValue(10);
		setArrValue(5);
	}

  return (
	<div className="main-container">
	  <div className="usercard">
		<button>
		  <span>DAS</span>
		  <input
			type="range"
			min="0"
			max={maxDAS - 1}
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
		<button className='button' onClick={keysPush}>Keys</button>
		<div className="button-row">
			<button className="button2" onClick={apply_options}>Apply</button>
			<button className="button2" onClick={reset_options}>Reset</button>
		</div>
	  </div>
	  <span style={{fontSize: '10px'}}>DAS: delayed auto shift (How long you have to hold down the button to before a piece starts flying to the wall)</span>
	  <span style={{fontSize: '10px'}}>ARR: auto repeat rate (how quickly the pieces move from right to left)</span>
	</div>
  );
}
