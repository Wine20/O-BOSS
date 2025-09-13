

import React, { useState, useCallback, useEffect } from 'react';
import type { WindowInstance, AppDefinition } from './types';
import { APPS } from './constants';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import LoginScreen from './components/auth/LoginScreen';

const StarryBackground = () => (
  <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a0a1a] to-[#1a1a3a] overflow-hidden">
    <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'1\'/%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\'/%3E%3Ccircle cx=\'90\' cy=\'90\' r=\'1\'/%3E%3Ccircle cx=\'10\' cy=\'90\' r=\'1\'/%3E%3Ccircle cx=\'90\' cy=\'10\' r=\'1\'/%3E%3Ccircle cx=\'30\' cy=\'70\' r=\'1\'/%3E%3Ccircle cx=\'70\' cy=\'30\' r=\'1\'/%3E%3Ccircle cx=\'20\' cy=\'50\' r=\'1\'/%3E%3Ccircle cx=\'80\' cy=\'50\' r=\'1\'/%3E%3Ccircle cx=\'50\' cy=\'20\' r=\'1\'/%3E%3Ccircle cx=\'50\' cy=\'80\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
  </div>
);

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [zIndexCounter, setZIndexCounter] = useState<number>(10);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('genesis-auth') === 'true';
  });

  const handleLoginSuccess = () => {
    sessionStorage.setItem('genesis-auth', 'true');
    setIsAuthenticated(true);
  };
  
  const openApp = useCallback((app: AppDefinition) => {
    setWindows(currentWindows => {
      const existingWindow = currentWindows.find(w => w.appId === app.id);
      if (existingWindow) {
        return currentWindows.map(w => 
          w.id === existingWindow.id ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false } : w
        );
      }
      
      const newWindow: WindowInstance = {
        id: `win-${app.id}-${Date.now()}`,
        appId: app.id,
        title: app.name,
        x: Math.random() * (window.innerWidth - (app.defaultSize?.width ?? 640)),
        y: Math.random() * (window.innerHeight - (app.defaultSize?.height ?? 480)),
        width: app.defaultSize?.width ?? 640,
        height: app.defaultSize?.height ?? 480,
        zIndex: zIndexCounter + 1,
        isMinimized: false,
      };
      setZIndexCounter(c => c + 1);
      return [...currentWindows, newWindow];
    });
  }, [zIndexCounter]);

  const closeWindow = useCallback((id: string) => {
    setWindows(currentWindows => currentWindows.filter(w => w.id !== id));
  }, []);

  // FIX: The call to setZIndexCounter was using `currentWindows`, which is out of scope.
  // The function is rewritten to correctly calculate the new top z-index and update
  // both `windows` and `zIndexCounter` state within the `setWindows` callback.
  const focusWindow = useCallback((id: string) => {
    setWindows(currentWindows => {
      const maxZ = Math.max(...currentWindows.map(w => w.zIndex), zIndexCounter);
      const newZ = maxZ + 1;
      setZIndexCounter(newZ);
      return currentWindows.map(w => 
        w.id === id ? { ...w, zIndex: newZ } : w
      );
    });
  }, [zIndexCounter]);


  const toggleMinimize = useCallback((id: string) => {
    setWindows(currentWindows =>
      currentWindows.map(w =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      )
    );
  }, []);

  const updateWindowPosition = useCallback((id: string, newPos: { x: number; y: number }) => {
    setWindows(currentWindows =>
      currentWindows.map(w => (w.id === id ? { ...w, ...newPos } : w))
    );
  }, []);

  if (!isAuthenticated) {
    return (
       <div className="w-screen h-screen overflow-hidden bg-black text-white select-none">
          <StarryBackground />
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
       </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-black text-white select-none">
      <StarryBackground />
      <div className="relative z-10 w-full h-full flex flex-col">
        <TopBar />
        <main className="flex-grow w-full h-full">
          {windows.map(win => {
            const AppToRender = APPS.find(app => app.id === win.appId)?.component;
            if (!AppToRender) return null;
            return (
              <Window
                key={win.id}
                instance={win}
                onClose={() => closeWindow(win.id)}
                onFocus={() => focusWindow(win.id)}
                onMinimize={() => toggleMinimize(win.id)}
                onPositionChange={(newPos) => updateWindowPosition(win.id, newPos)}
              >
                <AppToRender onClose={() => closeWindow(win.id)} />
              </Window>
            );
          })}
        </main>
        <Dock openApp={openApp} runningApps={windows.map(w=>w.appId)} onAppClick={(appId) => {
           const win = windows.find(w=> w.appId === appId);
           if(win) {
             focusWindow(win.id);
             if(win.isMinimized) toggleMinimize(win.id);
           }
        }}/>
      </div>
    </div>
  );
};

export default App;
