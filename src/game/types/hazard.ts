/**
 * Moving hazard that resets the game on collision
 */
export interface Hazard {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  color: string;
}
