import type { Hazard } from "../types/hazard";
import type { Particle } from "../types/particle";
import type { Player } from "../types/player";
import type { Target } from "../types/target";

/**
 * Manages all rendering operations for the game canvas
 * Handles drawing of game entities, background elements, and visual effects
 */
export class RendererManager {
  private context: CanvasRenderingContext2D;

  /**
   * Initialize the renderer with a canvas context
   * @param context - 2D canvas rendering context for drawing operations
   */
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  /**
   * Clear the entire canvas for the next frame
   * @param width - Canvas width in pixels
   * @param height - Canvas height in pixels
   */
  public clear(width: number, height: number): void {
    this.context.clearRect(0, 0, width, height);
  }

  /**
   * Draw a subtle background grid for visual depth
   * @param width - Canvas width for grid boundaries
   * @param height - Canvas height for grid boundaries
   */
  public drawGrid(width: number, height: number): void {
    this.context.globalAlpha = 0.45;
    this.context.lineWidth = 1;
    this.context.strokeStyle = "#1f2937";

    const grid = 40;

    // Draw vertical grid lines
    for (let x = 0; x < width; x += grid) {
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, height);
      this.context.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y < height; y += grid) {
      this.context.beginPath();
      this.context.moveTo(0, y);
      this.context.lineTo(width, y);
      this.context.stroke();
    }

    this.context.globalAlpha = 1;
  }

  /**
   * Draw all collectible targets with highlighting rings
   * @param targets - Array of target objects to render
   */
  public drawTargets(targets: Target[]): void {
    for (const t of targets) {
      // Draw main target circle
      this.context.fillStyle = t.color;
      this.context.beginPath();
      this.context.arc(t.x, t.y, t.r, 0, Math.PI * 2);
      this.context.fill();

      // Draw outer highlight ring for visibility
      this.context.strokeStyle = "rgba(249,115,22,0.35)";
      this.context.beginPath();
      this.context.arc(t.x, t.y, t.r + 6, 0, Math.PI * 2);
      this.context.stroke();
    }
  }

  /**
   * Draw all hazard objects as solid circles
   * @param hazards - Array of hazard objects to render
   */
  public drawHazards(hazards: Hazard[]): void {
    for (const hz of hazards) {
      this.context.fillStyle = hz.color;
      this.context.beginPath();
      this.context.arc(hz.x, hz.y, hz.r, 0, Math.PI * 2);
      this.context.fill();
    }
  }

  /**
   * Draw the player with trail effects and glow
   * @param player - Player object containing position, trail, and visual data
   */
  public drawPlayer(player: Player): void {
    // Draw fading trail particles behind player
    for (const p of player.trail) {
      this.context.globalAlpha = Math.max(p.life, 0);
      this.context.fillStyle = "#22d3ee";
      this.context.beginPath();
      this.context.arc(p.x, p.y, 6 * p.life, 0, Math.PI * 2);
      this.context.fill();
    }
    this.context.globalAlpha = 1;

    // Draw player with glowing effect
    this.context.shadowColor = "#22d3ee";
    this.context.shadowBlur = 18;
    this.context.fillStyle = player.color;
    this.context.beginPath();
    this.context.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    this.context.fill();
    this.context.shadowBlur = 0;
  }

  /**
   * Draw explosion particles with fading effect
   * @param particles - Array of particle objects from explosions
   */
  public drawParticles(particles: Particle[]): void {
    for (const p of particles) {
      this.context.globalAlpha = Math.max(p.life, 0);
      this.context.fillStyle = "#ef4444";
      this.context.beginPath();
      this.context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.context.fill();
    }
    this.context.globalAlpha = 1;
  }
}
