
import React from 'react';
import type { AppDefinition } from './types';
import WelcomeApp from './components/apps/WelcomeApp';
import AboutApp from './components/apps/AboutApp';
import BrowserApp from './components/apps/BrowserApp';
import GenesisAIApp from './components/apps/GenesisAIApp';

const GoldenIconWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="w-12 h-12 flex items-center justify-center">
    {children}
  </div>
);

export const APPS: AppDefinition[] = [
  {
    id: 'genesis-ai',
    name: 'Génesis AI',
    icon: (
      <GoldenIconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.455-2.455L12.75 18l1.197-.398a3.375 3.375 0 002.455-2.455L16.5 14.25l.398 1.197a3.375 3.375 0 002.455 2.455L20.25 18l-1.197.398a3.375 3.375 0 00-2.455 2.455z" />
        </svg>
      </GoldenIconWrapper>
    ),
    component: GenesisAIApp,
    defaultSize: { width: 450, height: 650 },
  },
  {
    id: 'welcome',
    name: 'Welcome',
    icon: (
      <GoldenIconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </GoldenIconWrapper>
    ),
    component: WelcomeApp,
    defaultSize: { width: 500, height: 350 },
  },
  {
    id: 'about',
    name: 'About Génesis',
    icon: (
      <GoldenIconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </GoldenIconWrapper>
    ),
    component: AboutApp,
    defaultSize: { width: 500, height: 400 },
  },
  {
    id: 'browser',
    name: 'Universe Web',
    icon: (
      <GoldenIconWrapper>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m-9 9a9 9 0 009 9m-9-9h18" />
        </svg>
      </GoldenIconWrapper>
    ),
    component: BrowserApp,
    defaultSize: { width: 800, height: 600 },
  },
];
