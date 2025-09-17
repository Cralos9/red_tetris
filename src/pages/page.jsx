'use client';
import {useState, useContext, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from "../Contexts.js"

export default function Home() {
  const [username, setUsername] = useState();
  const navigate = useNavigate();
	const store = useContext(StoreContext)

  function handleButton(e)
  {
	e.preventDefault();
	const name = document.getElementById('username')
	if(!name.value || !name.value.match(/^[0-9a-zA-Z]+$/))
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
	navigate('/game');
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
