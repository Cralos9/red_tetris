'use client';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useEffect} from 'react';

export default function Keys() {
  const router = useRouter();

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
      rotateRight: localStorage.getItem("rotateRight") || 'x',
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
      if (e.key) {
        const keyInUse = Object.entries(keys).find(
          ([otherAction, value]) => value === e.key && otherAction !== action
        );
  
        if (keyInUse) {
          alert(`Key "${e.key}" is already used for "${keyInUse[0]}"`);
        } else {
          setKeys((prev) => ({
            ...prev,
            [action]: e.key,
          }));
          setEditingKey(null);
        }
  
        document.removeEventListener('keydown', handler);
      }
    };
  
    document.addEventListener('keydown', handler);
  };

  const apply_options = () => {
    for (const [action, key] of Object.entries(keys))
        localStorage.setItem(action, key)  
    router.push('/options');
  };

  function reset_options()
  {
    setKeys({
        left: 'ArrowLeft',
        right: 'ArrowRight',
        rotateLeft: 'z',
        rotateRight: 'x',
        hardDrop: ' ',
        softDrop: 'ArrowDown',
        holdPiece: 'c',
      });
  }

  return (
    <div className="main-container">
      <div className="usercard">
        <button onClick={() => changeKey('left')} style={{ color: 'white' }}>
          Move Left {keys.left}
        </button>
        <button onClick={() => changeKey('right')} style={{ color: 'white' }}>
          Move Right {keys.right}
        </button>
        <button onClick={() => changeKey('rotateLeft')} style={{ color: 'white' }}>
          Rotate Left {keys.rotateLeft}
        </button>
        <button onClick={() => changeKey('rotateRight')} style={{ color: 'white' }}>
          Rotate Right {keys.rotateRight}
        </button>
        <button onClick={() => changeKey('hardDrop')} style={{ color: 'white' }}>
          Hard Drop {keys.hardDrop === ' ' ? 'Space' : keys.hardDrop}
        </button>
        <button onClick={() => changeKey('softDrop')} style={{ color: 'white' }}>
          Soft Drop {keys.softDrop}
        </button>
        <button onClick={() => changeKey('holdPiece')} style={{ color: 'white' }}>
          Hold Piece {keys.holdPiece}
        </button>
        <div className="button-row">
          <button className="button2" onClick={apply_options}>
            Apply
          </button>
          <button className="button2" onClick={reset_options}>Reset</button>
        </div>
        {editingKey && <p style={{ color: 'white' }}>Press a key to bind: {editingKey}</p>}
      </div>
    </div>
  );
}
