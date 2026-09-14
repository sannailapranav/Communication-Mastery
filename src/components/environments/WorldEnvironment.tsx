import React from 'react';

export interface WorldEnvironmentProps {
  worldNumber: number; // 1 to 12
  environmentType?: 'presence' | 'voice' | 'thinking' | 'social' | 'framework' | 'psychology' | 'boardroom' | 'mastery';
  children?: React.ReactNode;
  className?: string;
}

export const WorldEnvironment: React.FC<WorldEnvironmentProps> = ({
  worldNumber = 1,
  children,
  className = ''
}) => {
  return (
    <div className={`relative w-full h-full min-h-[540px] overflow-hidden rounded-3xl border border-zinc-200/90 bg-white flex flex-col justify-between shadow-xs ${className}`}>
      {/* Architectural subtle watermark background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-5 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:20px_20px]" />

      {/* Children content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
