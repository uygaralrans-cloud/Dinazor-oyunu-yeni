
export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  EVOLVING = 'EVOLVING',
  GAMEOVER = 'GAMEOVER'
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Dino extends GameObject {
  dy: number;
  jumpForce: number;
  grounded: boolean;
  isJumping: boolean;
  isDashing: boolean;
  dashCooldown: number;
  score: number;
}

export interface Obstacle extends GameObject {
  speed: number;
  type: 'cactus' | 'bird' | 'laser';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface EvolutionData {
  sectorName: string;
  description: string;
  mutationEffect: string;
  colorTheme: string;
}
