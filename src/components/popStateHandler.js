'use client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PopStateHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = () => {
      navigate('/game', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return null;
}
