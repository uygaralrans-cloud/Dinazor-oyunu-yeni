
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, EvolutionData } from './types';
import GameEngine from './components/GameEngine';
import UIOverlay from './components/UIOverlay';
import { getEvolutionContent } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [evolution, setEvolution] = useState<EvolutionData | null>(null);
  const [isEvolving, setIsEvolving] = useState(false);
  const nextMilestone = useRef(1000);

  useEffect(() => {
    const saved = localStorage.getItem('neon-dino-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setGameState(GameState.GAMEOVER);
    setScore(finalScore);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('neon-dino-highscore', finalScore.toString());
    }
  }, [highScore]);

  const triggerEvolution = useCallback(async (currentScore: number) => {
    setIsEvolving(true);
    setGameState(GameState.EVOLVING);
    
    const data = await getEvolutionContent(currentScore);
    setEvolution(data);
    
    // Auto-resume after 4 seconds of showing the evolution
    setTimeout(() => {
      setGameState(GameState.PLAYING);
      setIsEvolving(false);
      nextMilestone.current += 1000;
    }, 4500);
  }, []);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore);
    if (newScore >= nextMilestone.current && !isEvolving) {
      triggerEvolution(newScore);
    }
  }, [isEvolving, triggerEvolution]);

  const startGame = () => {
    setScore(0);
    setGameState(GameState.PLAYING);
    setEvolution(null);
    nextMilestone.current = 1000;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      <GameEngine 
        gameState={gameState} 
        onGameOver={handleGameOver} 
        onScoreUpdate={handleScoreUpdate}
        themeColor={evolution?.colorTheme || '#00f2ff'}
      />

      <UIOverlay 
        gameState={gameState}
        score={score}
        highScore={highScore}
        evolution={evolution}
        onStart={startGame}
      />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-50 bg-[length:100%_4px,3px_100%]"></div>
    </div>
  );
};

export default App;
