'use client';
import { useNavigate } from 'react-router';
import { useState } from "react";
import { useEffect} from 'react';
import {SupportedKeys} from "../../../../../common.js";

export default function Keys() {
  const navigate = useNavigate();


  const [keys, setKeys] = useState({
    left: '',
    right: '',
    rotateLeft: '',
    rotateRight: '',
    hardDrop: '',
    softDrop: '',
    holdPiece: '',
  });
  
  useEffect(() => {
    setKeys({
      left: localStorage.getItem("left") || 'ArrowLeft',
      right: localStorage.getItem("right") || 'ArrowRight',
      rotateLeft: localStorage.getItem("rotateLeft") || 'z',
      rotateRight: localStorage.getItem("rotateRight") || 'ArrowUp',
      hardDrop: localStorage.getItem("hardDrop") || ' ',
      softDrop: localStorage.getItem("softDrop") || 'ArrowDown',
      holdPiece: localStorage.getItem("holdPiece") || 'c',
    });
  }, []);

  const [editingKey, setEditingKey] = useState(null);

  const changeKey = (action) => {
    setEditingKey(action);
  
    const handler = (e) => {
      e.preventDefault();
      var keyUsable = 0;
      if (e.key) {
        SupportedKeys.forEach(key => {
          if(key == e.key)
            keyUsable = 1;
        });
        const keyInUse = Object.entries(keys).find(
          ([otherAction, value]) => value === e.key && otherAction !== action
        );
        if(!keyUsable)
          alert(`Key "${e.key}" is not usable`);
        else if (keyInUse) 
          alert(`Key "${e.key}" is already used for "${keyInUse[0]}"`);
        else 
        {
          setKeys((prev) => ({
            ...prev,
            [action]: e.key,
          }));
          setEditingKey(null);
        }
      }
      document.removeEventListener('keydown', handler);
      document.removeEventListener('mousedown', handler);
    };
  
    document.addEventListener('keydown', handler);
    document.addEventListener('mousedown', handler);
  };

  const apply_options = () => {
    for (const [action, key] of Object.entries(keys))
        localStorage.setItem(action, key)  
    navigate('/options');
  };

  function reset_options()
  {
    setKeys({
        left: 'ArrowLeft',
        right: 'ArrowRight',
        rotateLeft: 'z',
        rotateRight: 'ArrowUp',
        hardDrop: ' ',
        softDrop: 'ArrowDown',
        holdPiece: 'c',
      });
  }

  return (
    <div className="main-container">
      <div className="usercard">
        <button
          className={`button3 ${editingKey === 'left' ? 'editing' : ''}`}
          onClick={() => changeKey('left')}
          style={{ color: 'white' }}
        >
          Move Left: {`'${keys.left === ' ' ? 'Space' : keys.left}'`}
        </button>
  
        <button
          className={editingKey === 'right' ? 'editing' : ''}
          onClick={() => changeKey('right')}
          style={{ color: 'white' }}
        >
          Move Right: {`'${keys.right === ' ' ? 'Space' : keys.right}'`}
        </button>
  
        <button
          className={editingKey === 'rotateLeft' ? 'editing' : ''}
          onClick={() => changeKey('rotateLeft')}
          style={{ color: 'white' }}
        >
          Rotate Left: {`'${keys.rotateLeft === ' ' ? 'Space' : keys.rotateLeft}'`}
        </button>
  
        <button
          className={editingKey === 'rotateRight' ? 'editing' : ''}
          onClick={() => changeKey('rotateRight')}
          style={{ color: 'white' }}
        >
          Rotate Right: {`'${keys.rotateRight === ' ' ? 'Space' : keys.rotateRight}'`}
        </button>
  
        <button
          className={editingKey === 'hardDrop' ? 'editing' : ''}
          onClick={() => changeKey('hardDrop')}
          style={{ color: 'white' }}
        >
          Hard Drop: {`'${keys.hardDrop === ' ' ? 'Space' : keys.hardDrop}'`}
        </button>
  
        <button
          className={editingKey === 'softDrop' ? 'editing' : ''}
          onClick={() => changeKey('softDrop')}
          style={{ color: 'white' }}
        >
          Soft Drop: {`'${keys.softDrop === ' ' ? 'Space' : keys.softDrop}'`}
        </button>
  
        <div className="button-row">
          <button className="button2" onClick={apply_options}>
            Apply
          </button>
          <button className="button2" onClick={reset_options}>Reset</button>
        </div>
      </div>
    </div>
  );
}
