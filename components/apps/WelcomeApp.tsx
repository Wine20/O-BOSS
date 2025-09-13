
import React from 'react';

const WelcomeApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-b-md text-white p-6 text-center">
      <h1 className="text-4xl font-bold font-orbitron mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500">
          Bem-vindo
        </span>
      </h1>
      <p className="text-lg mb-2">ao</p>
      <h2 className="text-3xl font-bold font-orbitron mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-yellow-400 to-amber-600">
          Génesis Universe
        </span>
      </h2>
      <p className="text-gray-300 max-w-sm">
        Seu universo pessoal de produtividade e criatividade. Explore os aplicativos no dock para começar.
      </p>
    </div>
  );
};

export default WelcomeApp;
