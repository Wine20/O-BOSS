
import React from 'react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: JSX.Element;
  component: React.FC<{ onClose: () => void }>;
  defaultSize?: { width: number; height: number };
}

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
}
