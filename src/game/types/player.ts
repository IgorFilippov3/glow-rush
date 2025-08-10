import type { TrailPoint } from "./trall-point";

/**
 * Player entity with movement and dash capabilities
 */
export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  speed: number;
  maxSpeed: number;
  dashPower: number;
  dashCooldownMs: number;
  lastDashAt: number;
  trail: TrailPoint[];
}
