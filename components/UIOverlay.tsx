
import React from 'react';
import { GameState, EvolutionData } from '../types';

interface UIOverlayProps {
  gameState: GameState;
  score: number;
  highScore: number;
  evolution: EvolutionData | null;
  onStart: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, score, highScore, evolution, onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
      
      {/* Top HUD */}
      <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col">
          <span className="text-white/40 text-xs tracking-[0.2em] font-bold uppercase">System Status</span>
          <span className="text-cyan-400 font-orbitron text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            {gameState === GameState.PLAYING ? 'RUNNING' : gameState}
          </span>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex gap-8">
            <div className="text-right">
              <span className="text-white/40 text-xs tracking-[0.2em] font-bold uppercase">Distance</span>
              <div className="text-white font-orbitron text-2xl">{score.toString().padStart(6, '0')}m</div>
            </div>
            <div className="text-right">
              <span className="text-white/40 text-xs tracking-[0.2em] font-bold uppercase">Hi-Record</span>
              <div className="text-white/60 font-orbitron text-2xl">{highScore.toString().padStart(6, '0')}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Message */}
      {gameState === GameState.EVOLVING && evolution && (
        <div className="bg-black/80 backdrop-blur-md border-y-2 border-cyan-500/50 w-full py-12 flex flex-col items-center animate-in fade-in zoom-in duration-300">
          <div className="text-cyan-400 text-sm tracking-[0.5em] font-bold uppercase mb-2 animate-pulse">Evolution Triggered</div>
          <h2 className="text-white font-orbitron text-5xl mb-4 text-center px-4" style={{ color: evolution.colorTheme }}>
            {evolution.sectorName}
          </h2>
          <p className="text-white/70 text-xl font-light italic mb-6 max-w-md text-center">
            "{evolution.description}"
          </p>
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-12 bg-white/20"></div>
             <span className="text-white font-bold tracking-widest text-sm bg-white/10 px-4 py-1 rounded">
               MUTATION: {evolution.mutationEffect.toUpperCase()}
             </span>
             <div className="h-[2px] w-12 bg-white/20"></div>
          </div>
        </div>
      )}

      {/* Start Screen */}
      {gameState === GameState.START && (
        <div className="flex flex-col items-center pointer-events-auto">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500 font-orbitron text-7xl font-bold mb-4 drop-shadow-[0_0_20px_rgba(0,242,255,0.4)]">
            NEON DINO
          </h1>
          <p className="text-cyan-400/60 tracking-[0.3em] uppercase text-sm mb-12 font-bold">A.I. Neural Runner v3.0</p>
          <button 
            onClick={onStart}
            className="group relative px-12 py-4 bg-transparent border-2 border-cyan-500 overflow-hidden transition-all hover:bg-cyan-500"
          >
            <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <span className="relative text-cyan-500 group-hover:text-black font-orbitron text-xl font-bold tracking-widest">
              INITIATE SEQUENCE
            </span>
          </button>
          <p className="mt-8 text-white/40 text-xs animate-bounce font-bold">PRESS [SPACE] TO JUMP</p>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === GameState.GAMEOVER && (
        <div className="flex flex-col items-center pointer-events-auto bg-black/60 p-12 backdrop-blur-sm rounded-3xl border border-red-500/30">
          <h2 className="text-red-500 font-orbitron text-6xl font-bold mb-2 animate-pulse">CONNECTION LOST</h2>
          <p className="text-white/40 mb-8 uppercase tracking-widest font-bold">Critical System Failure detected</p>
          
          <div className="grid grid-cols-2 gap-8 mb-12 w-full">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-white/40 text-xs uppercase mb-1">Final Score</div>
              <div className="text-white font-orbitron text-3xl">{score}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="text-white/40 text-xs uppercase mb-1">Peak Evolution</div>
              <div className="text-white font-orbitron text-3xl">#SCTR-9</div>
            </div>
          </div>

          <button 
            onClick={onStart}
            className="group relative px-16 py-4 bg-red-600 hover:bg-red-500 transition-colors rounded-none"
          >
            <span className="text-white font-orbitron text-xl font-bold tracking-widest">
              REBOOT SYSTEM
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UIOverlay;
