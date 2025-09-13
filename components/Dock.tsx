
import React from 'react';
import type { AppDefinition } from '../types';
import { APPS } from '../constants';
import Icon from './Icon';

interface DockProps {
  openApp: (app: AppDefinition) => void;
  runningApps: string[];
  onAppClick: (appId: string) => void;
}

const Dock: React.FC<DockProps> = ({ openApp, runningApps, onAppClick }) => {
  return (
    <footer className="w-full flex justify-center pb-2 z-40">
      <div className="flex items-end h-20 p-2 space-x-2 bg-black/30 backdrop-blur-lg rounded-xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
        {APPS.map(app => (
          <div key={app.id} className="relative">
            <Icon
              name={app.name}
              icon={app.icon}
              onClick={() => {
                if(runningApps.includes(app.id)) {
                  onAppClick(app.id);
                } else {
                  openApp(app);
                }
              }}
            />
            {runningApps.includes(app.id) && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50"></div>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Dock;
