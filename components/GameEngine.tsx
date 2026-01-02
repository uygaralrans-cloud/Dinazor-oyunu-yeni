
import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Dino, Obstacle, Particle } from '../types';

interface GameEngineProps {
  gameState: GameState;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  themeColor: string;
}

const GameEngine: React.FC<GameEngineProps> = ({ gameState, onGameOver, onScoreUpdate, themeColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  
  // Game State Refs (to avoid re-renders during loop)
  const dinoRef = useRef<Dino>({
    x: 100,
    y: 0,
    width: 60,
    height: 60,
    color: '#00f2ff',
    dy: 0,
    jumpForce: 18,
    grounded: false,
    isJumping: false,
    isDashing: false,
    dashCooldown: 0,
    score: 0
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const scoreRef = useRef(0);
  const gameSpeedRef = useRef(7);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef(0);

  const initGame = useCallback(() => {
    dinoRef.current = {
      x: 100,
      y: 340,
      width: 50,
      height: 60,
      color: themeColor,
      dy: 0,
      jumpForce: 16,
      grounded: true,
      isJumping: false,
      isDashing: false,
      dashCooldown: 0,
      score: 0
    };
    obstaclesRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    gameSpeedRef.current = 7;
    spawnTimerRef.current = 0;
  }, [themeColor]);

  const spawnObstacle = () => {
    const types: ('cactus' | 'bird' | 'laser')[] = ['cactus', 'cactus', 'bird'];
    const type = types[Math.floor(Math.random() * types.length)];
    const height = type === 'bird' ? 30 : 40 + Math.random() * 40;
    const y = type === 'bird' ? 220 + Math.random() * 50 : 400 - height;
    
    obstaclesRef.current.push({
      x: 1000,
      y,
      width: 30,
      height,
      color: themeColor,
      speed: gameSpeedRef.current,
      type
    });
  };

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      });
    }
  };

  const update = (time: number) => {
    if (gameState !== GameState.PLAYING) {
      if (gameState === GameState.EVOLVING) {
          // Keep rendering the background but pause movement
          draw();
          requestRef.current = requestAnimationFrame(update);
      }
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Dino Physics
    const dino = dinoRef.current;
    const gravity = 0.8;
    
    dino.dy += gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > 400) {
      dino.y = 400 - dino.height;
      dino.dy = 0;
      dino.grounded = true;
      dino.isJumping = false;
    }

    // Score & Difficulty
    scoreRef.current += 1;
    if (scoreRef.current % 100 === 0) {
      onScoreUpdate(scoreRef.current);
      gameSpeedRef.current += 0.1;
    }

    // Obstacles
    spawnTimerRef.current--;
    if (spawnTimerRef.current <= 0) {
      spawnObstacle();
      spawnTimerRef.current = 80 + Math.random() * 100 - (gameSpeedRef.current * 2);
    }

    obstaclesRef.current.forEach((obs, index) => {
      obs.x -= gameSpeedRef.current;
      
      // Collision Check
      if (
        dino.x < obs.x + obs.width &&
        dino.x + dino.width > obs.x &&
        dino.y < obs.y + obs.height &&
        dino.y + dino.height > obs.y
      ) {
        createExplosion(dino.x + dino.width/2, dino.y + dino.height/2, '#ff0055');
        onGameOver(scoreRef.current);
      }
    });

    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x + obs.width > -100);

    // Particles
    particlesRef.current.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid Background (Cyberpunk feel)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i - (scoreRef.current % 50), 0);
      ctx.lineTo(i - (scoreRef.current % 50), canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }

    // Ground line
    ctx.shadowBlur = 15;
    ctx.shadowColor = themeColor;
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(canvas.width, 400);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Dino
    const dino = dinoRef.current;
    ctx.fillStyle = themeColor;
    ctx.shadowBlur = 20;
    ctx.shadowColor = themeColor;
    
    // Dino Body (Sleek Shape)
    ctx.beginPath();
    ctx.roundRect(dino.x, dino.y, dino.width, dino.height, 8);
    ctx.fill();

    // Dino Eye
    ctx.fillStyle = '#000';
    ctx.fillRect(dino.x + dino.width - 15, dino.y + 10, 8, 8);
    
    // Draw Obstacles
    ctx.shadowBlur = 10;
    obstaclesRef.current.forEach(obs => {
      ctx.fillStyle = obs.type === 'bird' ? '#fff' : themeColor;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      
      // Glitch effect on obstacles
      if (Math.random() > 0.98) {
          ctx.fillStyle = '#ff00ff';
          ctx.fillRect(obs.x - 5, obs.y, obs.width + 10, 2);
      }
    });

    // Draw Particles
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        const dino = dinoRef.current;
        if (dino.grounded) {
          dino.dy = -dino.jumpForce;
          dino.grounded = false;
          dino.isJumping = true;
          // Jump particles
          createExplosion(dino.x + dino.width/2, 400, themeColor);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [themeColor]);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      if (!requestRef.current) {
        initGame();
        lastTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(update);
      }
    } else if (gameState === GameState.START) {
        initGame();
        draw();
    } else if (gameState === GameState.GAMEOVER) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    }
  }, [gameState, initGame]);

  return (
    <div className="relative border-4 border-white/10 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500}
        className="block max-w-full h-auto cursor-pointer"
      />
    </div>
  );
};

export default GameEngine;
