import type { Player } from "../types/player";
import type { InputManager } from "./input-manager";

/**
 * Manages player movement, physics, and dash mechanics
 */
export class PlayerManager {
  public player: Player;
  private initialData: Player;

  /**
   * Initialize player manager
   * @param player - Player object to manage
   */
  constructor(player: Player) {
    this.player = player;
    this.initialData = Object.assign({}, player);
  }

  /**
   * Attempt to perform a dash move if cooldown allows
   * @param inputManager - Input manager to check current key states
   */
  public tryDash(inputManager: InputManager): void {
    const now = performance.now();
    // Check if dash is still on cooldown
    if (now - this.player.lastDashAt < this.player.dashCooldownMs) return;

    // Use current velocity as dash direction
    let dirx = this.player.vx;
    let diry = this.player.vy;

    // If player is stationary, use current input direction
    if (Math.hypot(dirx, diry) < 0.01) {
      dirx =
        (inputManager.isKeyPressed("arrowright") ||
        inputManager.isKeyPressed("d")
          ? 1
          : 0) -
        (inputManager.isKeyPressed("arrowleft") ||
        inputManager.isKeyPressed("a")
          ? 1
          : 0);
      diry =
        (inputManager.isKeyPressed("arrowdown") ||
        inputManager.isKeyPressed("s")
          ? 1
          : 0) -
        (inputManager.isKeyPressed("arrowup") || inputManager.isKeyPressed("w")
          ? 1
          : 0);
    }

    // Normalize direction and apply dash force
    const len = Math.hypot(dirx, diry) || 1;
    this.player.vx += (dirx / len) * this.player.dashPower;
    this.player.vy += (diry / len) * this.player.dashPower;
    this.player.lastDashAt = now;

    // Create visual trail burst for dash effect
    for (let i = 0; i < 10; i++) {
      this.player.trail.push({ x: this.player.x, y: this.player.y, life: 1 });
    }
  }

  /**
   * Update player physics, movement, and trail effects
   * @param dt - Delta time for frame-rate independent movement
   * @param inputManager - Input manager for movement controls
   * @param canvasWidth - Canvas width for boundary collision
   * @param canvasHeight - Canvas height for boundary collision
   */
  public update(
    dt: number,
    inputManager: any,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    const { ax, ay } = inputManager.getMovementInput();

    // Apply acceleration based on input
    if (ax || ay) {
      const len = Math.hypot(ax, ay) || 1;
      this.player.vx += (ax / len) * this.player.speed * (dt * 0.06);
      this.player.vy += (ay / len) * this.player.speed * (dt * 0.06);
    }

    // Apply friction to gradually slow down
    this.player.vx *= 0.92;
    this.player.vy *= 0.92;

    // Cap maximum speed (allow extra for dash)
    const speed = Math.hypot(this.player.vx, this.player.vy);
    const max = this.player.maxSpeed + 8;
    if (speed > max) {
      const f = max / speed;
      this.player.vx *= f;
      this.player.vy *= f;
    }

    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    // Handle boundary collisions with bounce effect
    if (this.player.x < this.player.r) {
      this.player.x = this.player.r;
      this.player.vx *= -0.4;
    }
    if (this.player.x > canvasWidth - this.player.r) {
      this.player.x = canvasWidth - this.player.r;
      this.player.vx *= -0.4;
    }
    if (this.player.y < this.player.r) {
      this.player.y = this.player.r;
      this.player.vy *= -0.4;
    }
    if (this.player.y > canvasHeight - this.player.r) {
      this.player.y = canvasHeight - this.player.r;
      this.player.vy *= -0.4;
    }

    // Update trail particles (fade over time)
    for (let i = this.player.trail.length - 1; i >= 0; i--) {
      const p = this.player.trail[i];
      p.life -= dt * 0.003;
      if (p.life <= 0) {
        this.player.trail.splice(i, 1);
      }
    }
  }

  /**
   * Reset player to center position with no velocity
   * @param canvasWidth - Canvas width for center calculation
   * @param canvasHeight - Canvas height for center calculation
   */
  public resetPosition(canvasWidth: number, canvasHeight: number): void {
    this.player.x = canvasWidth / 2;
    this.player.y = canvasHeight / 2;
    this.player.vx = 0;
    this.player.vy = 0;
  }

  /**
   * Reset player max speed to initial state
   */
  public resetMaxSpeed(): void {
    this.player.speed = this.initialData.speed;
  }

  /**
   * Reset player size to initial state
   */
  public resetSize(): void {
    this.player.r = this.initialData.r;
  }
}
