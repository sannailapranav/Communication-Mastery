import React from 'react';
import { GameHomeView } from './GameHomeView';

interface HomeDashboardProps {
  onNavigate: (tab: string, lessonId?: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  return (
    <GameHomeView
      onEnterJourney={() => onNavigate('journey')}
      onEnterLevel={(lvl) => onNavigate('journey', String(lvl))}
      onOpenFrameworks={() => onNavigate('frameworks')}
    />
  );
};
