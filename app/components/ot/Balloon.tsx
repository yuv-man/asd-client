// components/Balloon.js
import { useState, useEffect } from 'react';
import './styles/balloon.sass';
import { BalloonProps } from '@/types/props';
import balloonSvg from '@/assets/balloon.svg';
import Image from 'next/image';
import BalloonSVG from './BalloonSVG';

export default function Balloon({ id, color, size, position, popped, onClick }: BalloonProps) {
  const [isPopping, setIsPopping] = useState(false);
  
  const handleClick = () => {
    if (popped) return;
    
    setIsPopping(true);
    onClick(id, color);
  };
  
  useEffect(() => {
    if (!popped) setIsPopping(false);
  }, [popped]);
  
  return (
    <div
      className={`balloon ${isPopping ? 'popping' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size * 1.2}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        display: popped && !isPopping ? 'none' : 'block'
      }}
      onClick={handleClick}
    >
      <BalloonSVG 
        color={color}
      />
      <div className="balloonString"></div>
    </div>
  );
}