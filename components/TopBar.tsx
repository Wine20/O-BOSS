
import React, { useState, useEffect } from 'react';

const TopBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <header className="w-full h-8 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-between px-4 z-50 border-b border-yellow-500/30">
      <div className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="url(#gold-gradient)">
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        <span className="font-bold font-orbitron text-sm bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">
          The Génesis Universe
        </span>
      </div>
      <div className="text-sm font-sans text-gray-300">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </header>
  );
};

export default TopBar;
