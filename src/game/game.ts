import { CanvasManager } from "./managers/canvas-manager";
import { EntityManager } from "./managers/entity-manager";
import { InputManager } from "./managers/input-manager";
import { PlayerManager } from "./managers/player-manager";
import { RendererManager } from "./managers/renderer-manager";
import { UiManager } from "./managers/ui-manager";

/**
 * Main game class that orchestrates all game systems and manages the game loop
 * Coordinates canvas rendering, player input, entity management, and UI updates
 */
export class Game {
  private canvasManager: CanvasManager;
  private entityManager: EntityManager;
  private rendererManger: RendererManager;
  private playerManager: PlayerManager;
  private uiManager: UiManager;
  private inputManager: InputManager;

  private score = 0;
  private level = 1;
  private lastTime = performance.now();

  /**
   * Initialize all game systems and managers
   * @param canvasElement - HTML canvas element for rendering the game
   */
  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasManager = new CanvasManager(canvasElement);
    this.entityManager = new EntityManager(
      this.canvasManager.getWidth(),
      this.canvasManager.getHeight()
    );
    this.rendererManger = new RendererManager(this.canvasManager.context);
    this.playerManager = new PlayerManager({
      x: this.canvasManager.getWidth() / 2,
      y: this.canvasManager.getHeight() / 2,
      vx: 0,
      vy: 0,
      r: 12,
      color: "#22d3ee",
      speed: 3.2,
      maxSpeed: 5.0,
      dashPower: 12,
      dashCooldownMs: 700,
      lastDashAt: -9999,
      trail: [],
    });
    this.uiManager = new UiManager();
    this.inputManager = new InputManager();

    this.inputManager.setDashCallback(() => {
      this.playerManager.tryDash(this.inputManager);
    });
  }

  /**
   * Start the game by spawning initial targets and beginning the game loop
   */
  public start(): void {
    for (let i = 0; i < 3; i++) {
      this.entityManager.spawnTarget();
    }

    this.loop();
  }

  /**
   * Main game loop that handles timing, updates, and rendering
   * Called recursively using requestAnimationFrame for smooth 60fps
   */
  private loop(): void {
    // Calculate delta time for frame-rate independent movemen
    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    this.update(dt);
    this.draw();

    requestAnimationFrame(() => this.loop());
  }

  /**
   * Update all game logic for the current frame
   * @param dt - Delta time in milliseconds since last frame
   */
  private update(dt: number): void {
    this.playerManager.update(
      dt,
      this.inputManager,
      this.canvasManager.getWidth(),
      this.canvasManager.getHeight()
    );

    if (this.entityManager.checkTargetCollisions(this.playerManager.player)) {
      this.score += 1;
      this.uiManager.updateScore(this.score);
      if (this.score % 5 === 0) {
        this.levelUp();
      }
      this.entityManager.spawnTarget();
    }

    if (
      this.entityManager.hazards.length <
        Math.min(3 + Math.floor(this.level / 2), 10) &&
      Math.random() < 0.02
    ) {
      this.entityManager.spawnHazard();
    }

    this.entityManager.updateHazards();

    if (this.entityManager.checkHazardCollisions(this.playerManager.player)) {
      this.entityManager.boom(
        this.playerManager.player.x,
        this.playerManager.player.y
      );
      this.resetGame();
    }

    this.entityManager.updateParticles(dt);
    this.uiManager.updateCooldown(
      this.playerManager.player.lastDashAt,
      this.playerManager.player.dashCooldownMs
    );
  }

  /**
   * Increase game difficulty and player capabilities
   */
  private levelUp(): void {
    this.level += 1;
    this.uiManager.updateLevel(this.level);
    this.playerManager.player.maxSpeed += 0.2;
    this.playerManager.player.r += 1;
  }

  /**
   * Reset game to initial state after player death
   */
  private resetGame(): void {
    this.score = 0;
    this.level = 1;
    this.entityManager.hazards.length = 0;
    this.entityManager.targets.length = 0;
    this.uiManager.updateScore(0);
    this.uiManager.updateLevel(1);

    for (let i = 0; i < 3; i++) {
      this.entityManager.spawnTarget();
    }

    this.playerManager.resetPosition(
      this.canvasManager.getWidth(),
      this.canvasManager.getHeight()
    );
    this.playerManager.resetMaxSpeed();
    this.playerManager.resetSize();
  }

  /**
   * Render all visual elements for the current frame
   */
  private draw(): void {
    const width = this.canvasManager.getWidth();
    const height = this.canvasManager.getHeight();

    this.rendererManger.clear(width, height);
    this.rendererManger.drawGrid(width, height);
    this.rendererManger.drawTargets(this.entityManager.targets);
    this.rendererManger.drawHazards(this.entityManager.hazards);
    this.rendererManger.drawPlayer(this.playerManager.player);
    this.rendererManger.drawParticles(this.entityManager.particles);
  }
}
