import { clamp } from "../utils/clamp";

/**
 * Manages the game's user interface elements and HUD updates
 * Handles score display, level indicator, and cooldown visualization
 */
export class UiManager {
  private scoreEl: HTMLElement;
  private levelEl: HTMLElement;
  private coolbar: HTMLElement;

  /**
   * Initialize UI manager and cache DOM element references
   * Assumes HTML elements with IDs 'score', 'level', and 'coolbar' exist
   */
  constructor() {
    this.scoreEl = document.getElementById("score")!;
    this.levelEl = document.getElementById("level")!;
    this.coolbar = document.getElementById("coolbar")!;
  }

  /**
   * Update the score display in the HUD
   * @param score - Current player score to display
   */
  public updateScore(score: number): void {
    this.scoreEl.textContent = String(score);
  }

  /**
   * Update the level display in the HUD
   * @param level - Current game level to display
   */
  public updateLevel(level: number): void {
    this.levelEl.textContent = String(level);
  }

  /**
   * Update the dash cooldown progress bar
   * Calculates cooldown progress and updates the visual indicator
   * @param lastDashAt - Timestamp when dash was last used (in milliseconds)
   * @param cooldownMs - Total cooldown duration in milliseconds
   */
  public updateCooldown(lastDashAt: number, cooldownMs: number): void {
    // Calculate cooldown progress (0 = just used, 1 = ready to use)
    const cd = clamp((performance.now() - lastDashAt) / cooldownMs, 0, 1);
    this.coolbar.style.width = (cd * 100).toFixed(0) + "%";
  }
}
