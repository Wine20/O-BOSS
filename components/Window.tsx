
import React, { useState, useRef, useCallback } from 'react';
import type { WindowInstance } from '../types';

interface WindowProps {
  instance: WindowInstance;
  children: React.ReactNode;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
}

const WindowControls: React.FC<{ onClose: () => void; onMinimize: () => void; }> = ({ onClose, onMinimize }) => (
  <div className="flex items-center space-x-2">
    <button onClick={onMinimize} className="w-3.5 h-3.5 bg-yellow-500 rounded-full border border-yellow-700 hover:bg-yellow-400 focus:outline-none"></button>
    <button className="w-3.5 h-3.5 bg-gray-500 rounded-full border border-gray-700 cursor-not-allowed"></button>
    <button onClick={onClose} className="w-3.5 h-3.5 bg-red-500 rounded-full border border-red-700 hover:bg-red-400 focus:outline-none"></button>
  </div>
);

const Window: React.FC<WindowProps> = ({ instance, children, onClose, onFocus, onMinimize, onPositionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onFocus();
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = { x: instance.x, y: instance.y };
    e.preventDefault();
  }, [instance.x, instance.y, onFocus]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    onPositionChange({
      x: windowStartPos.current.x + dx,
      y: windowStartPos.current.y + dy,
    });
  }, [isDragging, onPositionChange]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);


  const windowClasses = `
    absolute flex flex-col
    bg-black/40 backdrop-blur-xl rounded-lg border border-yellow-500/40
    shadow-2xl shadow-yellow-600/20
    transition-transform duration-300 ease-out
    ${instance.isMinimized ? 'opacity-0 scale-90 -translate-y-full pointer-events-none' : 'opacity-100 scale-100'}
  `;

  return (
    <div
      className={windowClasses}
      style={{
        left: instance.x,
        top: instance.y,
        width: instance.width,
        height: instance.height,
        zIndex: instance.zIndex,
      }}
      onMouseDown={onFocus}
    >
      <header
        className="h-8 flex-shrink-0 flex items-center justify-between px-3 bg-gradient-to-b from-gray-800/80 to-gray-900/70 rounded-t-lg cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500 font-orbitron truncate">
          {instance.title}
        </span>
        <WindowControls onClose={onClose} onMinimize={onMinimize} />
      </header>
      <main className="flex-grow p-1 h-full overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Window;
