/**
 * Handles keyboard input for player movement and actions
 */
export class InputManager {
  private keys = new Set<string>();
  private dashCallback?: () => void;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Set callback function to execute when dash is triggered
   * @param callback - Function to call on dash input
   */

  public setDashCallback(callback: () => void): void {
    this.dashCallback = callback;
  }

  /**
   * Check if a specific key is currently pressed
   * @param key - Key to check
   * @returns True if key is pressed
   */
  public isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  /**
   * Get normalized movement input from keyboard
   * @returns Object with ax (horizontal) and ay (vertical) movement values (-1, 0, or 1)
   */
  public getMovementInput(): { ax: number; ay: number } {
    const ax =
      (this.isKeyPressed("arrowright") || this.isKeyPressed("d") ? 1 : 0) -
      (this.isKeyPressed("arrowleft") || this.isKeyPressed("a") ? 1 : 0);
    const ay =
      (this.isKeyPressed("arrowdown") || this.isKeyPressed("s") ? 1 : 0) -
      (this.isKeyPressed("arrowup") || this.isKeyPressed("w") ? 1 : 0);
    return { ax, ay };
  }

  /**
   * Set up keyboard event listeners for game controls
   */
  private setupEventListeners(): void {
    window.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "Spacebar",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
      this.keys.add(e.key.toLowerCase());
      if (e.key === " " || e.code === "Space") {
        this.dashCallback?.();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
  }
}
