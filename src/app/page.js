'use client';
import Link from 'next/link';
import {useState} from 'react'
import { useRouter } from 'next/navigation';


export default function Home() {
  const [username, setUsername] = useState();
  const router = useRouter();
  function handleButton(e)
  {
	e.preventDefault();
	const name = document.getElementById('username')
	if(!name.value || !name.value.match(/^[0-9a-z]+$/))
	{
		if (!name.value)
			name.placeholder = "Must have a user";
		else
		{
			name.placeholder = "Only alphanumeric characters";
			name.style.fontSize = '16px';
		}
		name.classList.add("error-placeholder");
		name.classList.add("shake")
		name.value = "";
		return;
	}
	localStorage.setItem("username", name.value);
	router.push('/game');
  }

  return (
	<div>
	  <div className="main-container">
		<form className='usercard'>
		  <h2 className='userTitle'>USERNAME</h2>
		  <div>
			<input className='input' placeholder='Enter username' maxLength={16} id='username'></input>
		  </div>
		  <button onClick={handleButton} className="button">Play</button>
		</form>
	  </div>
	</div>
  );
}
