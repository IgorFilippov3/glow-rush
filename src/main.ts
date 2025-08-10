import { Game } from "./game/game";
import "./style.css";

/**
 * Application entry point
 * Initializes and starts the game after DOM validation
 */
function main() {
  try {
    const canvas = document.getElementById("root") as HTMLCanvasElement;

    if (!canvas) {
      throw new Error("Canvas element with id 'root' not found in DOM");
    }

    if (canvas.tagName !== "CANVAS") {
      throw new Error("Element with id 'root' is not a canvas element");
    }

    const game = new Game(canvas);

    game.start();

    console.log("Game initialized successfully");
  } catch (error) {
    console.error("Failed to initialize game:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
