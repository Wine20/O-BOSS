
import React from 'react';

const AboutApp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="w-full h-full bg-gray-900/50 rounded-b-md text-white p-6 overflow-y-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
          The Génesis Universe
        </h1>
        <p className="text-sm text-yellow-300/80">Versão 1.0 "Aurea"</p>
      </div>
      <div className="space-y-4 text-gray-300">
        <p>
          O <span className="font-semibold text-yellow-400">Génesis Universe</span> é mais do que um sistema; é uma experiência. Projetado para ser uma camada elegante e funcional sobre qualquer sistema existente, ele oferece um conjunto de ferramentas integradas em um ambiente imersivo e unificado.
        </p>
        <p>
          Nossa filosofia é combinar estética de ponta com funcionalidade intuitiva. O tema dourado não é apenas uma escolha de design, mas um reflexo da qualidade e do valor que buscamos entregar em cada aplicativo e interação.
        </p>
        <p>
          Seja você um usuário casual ou um profissional, o Génesis foi criado para aprimorar seu fluxo de trabalho e inspirar a criatividade.
        </p>
      </div>
       <div className="text-center mt-8 text-xs text-amber-500/60">
        <p>&copy; {new Date().getFullYear()} Génesis Systems. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default AboutApp;
