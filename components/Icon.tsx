
import React from 'react';

interface IconProps {
  name: string;
  icon: JSX.Element;
  onClick: () => void;
}

const Icon: React.FC<IconProps> = ({ name, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center space-y-1 group focus:outline-none"
      aria-label={`Open ${name}`}
    >
      <div className="w-16 h-16 p-1 rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out group-hover:bg-white/10 group-hover:scale-110 group-active:scale-95">
        {icon}
      </div>
       <span className="hidden group-hover:block absolute -top-8 bg-gray-900/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
        {name}
      </span>
    </button>
  );
};

export default Icon;
