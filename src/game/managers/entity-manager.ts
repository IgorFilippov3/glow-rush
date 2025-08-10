import type { Hazard } from "../types/hazard";
import type { Particle } from "../types/particle";
import type { Player } from "../types/player";
import type { Target } from "../types/target";
import { dist2 } from "../utils/dist2";
import { rand } from "../utils/rand";

/**
 * Manages all game entities: targets, hazards, and particles
 */
export class EntityManager {
  public targets: Target[] = [];
  public hazards: Hazard[] = [];
  public particles: Particle[] = [];

  private canvasWidth: number;
  private canvasHeight: number;

  /**
   * Initialize entity manager with canvas dimensions
   * @param canvasWidth - Canvas width for boundary calculations
   * @param canvasHeight - Canvas height for boundary calculations
   */
  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  /**
   * Spawn a new collectible target at a random location
   */
  public spawnTarget(): void {
    const margin = 30;
    const r = 10;
    this.targets.push({
      x: rand(margin, this.canvasWidth - margin),
      y: rand(margin, this.canvasHeight - margin),
      r,
      color: "#f97316",
    });
  }

  /**
   * Spawn a new hazard from a random edge of the screen
   */
  public spawnHazard(): void {
    const r = rand(6, 10);
    const speed = rand(1.2, 2.2);
    const side = Math.random() < 0.5 ? "x" : "y";
    let x: number, y: number, vx: number, vy: number;

    if (side === "x") {
      // Enter from left or right side
      x = Math.random() < 0.5 ? -20 : this.canvasWidth + 20;
      y = rand(20, this.canvasHeight - 20);
      // Move towards opposite side
      vx = (x < 0 ? 1 : -1) * speed;
      // Small vertical drift
      vy = rand(-0.4, 0.4);
    } else {
      // Enter from top or bottom
      y = Math.random() < 0.5 ? -20 : this.canvasHeight + 20;
      x = rand(20, this.canvasWidth - 20);
      // Move towards opposite side
      vy = (y < 0 ? 1 : -1) * speed;
      // Small horizontal drift
      vx = rand(-0.4, 0.4);
    }

    this.hazards.push({ x, y, r, vx, vy, color: "#ef4444" });
  }

  /**
   * Update all hazards: move them and remove those outside boundaries
   */
  public updateHazards(): void {
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const hz = this.hazards[i];
      hz.x += hz.vx;
      hz.y += hz.vy;

      // Remove hazards that are far outside the screen
      if (
        hz.x < -40 ||
        hz.x > this.canvasWidth + 40 ||
        hz.y < -40 ||
        hz.y > this.canvasHeight + 40
      ) {
        this.hazards.splice(i, 1);
      }
    }
  }

  /**
   * Update explosion particles: move and fade them
   * @param dt - Delta time for animation
   */
  public updateParticles(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      // Fade particle over time
      p.life -= dt * 0.003;

      // Remove dead particles
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Create explosion effect at specified location
   * @param x - Explosion X coordinate
   * @param y - Explosion Y coordinate
   */
  public boom(x: number, y: number): void {
    // Create 24 particles in a circle pattern
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        x,
        y,
        vx: Math.cos(i) * rand(1, 3),
        vy: Math.sin(i) * rand(1, 3),
        r: rand(1, 3),
        life: 1,
      });
    }
  }

  /**
   * Check for collisions between player and targets
   * @param player - Player object to check against
   * @returns True if collision occurred (target was collected)
   */
  public checkTargetCollisions(player: Player): boolean {
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      if (dist2(player.x, player.y, t.x, t.y) < (player.r + t.r) ** 2) {
        this.targets.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Check for collisions between player and hazards
   * @param player - Player object to check against
   * @returns True if collision occurred
   */
  public checkHazardCollisions(player: Player): boolean {
    for (const hz of this.hazards) {
      if (dist2(player.x, player.y, hz.x, hz.y) < (player.r + hz.r) ** 2) {
        return true;
      }
    }
    return false;
  }
}
