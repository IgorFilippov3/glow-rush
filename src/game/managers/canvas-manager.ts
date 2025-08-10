/**
 * Manages canvas setup, resizing, and high-DPI support
 */
export class CanvasManager {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private dpi: number;

  /**
   * Initialize canvas with proper scaling and resize handling
   * @param canvas - HTML canvas element
   */
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d")!;
    this.dpi = Math.round(window.devicePixelRatio || 1);

    this.fitToParent();
    new ResizeObserver(() => this.resize()).observe(this.canvas);
  }

  /**
   * Get canvas width in logical pixels
   * @returns Canvas width adjusted for DPI
   */
  public getWidth(): number {
    return this.canvas.width / this.dpi;
  }

  /**
   * Get canvas height in logical pixels
   * @returns Canvas height adjusted for DPI
   */
  public getHeight(): number {
    return this.canvas.height / this.dpi;
  }

  /**
   * Resize canvas to match current container size with DPI scaling
   */
  private resize(): void {
    const { clientWidth: w, clientHeight: h } = this.canvas;
    this.canvas.width = Math.max(640, w) * this.dpi;
    this.canvas.height = Math.max(420, h) * this.dpi;
    // Scale context to draw in CSS pixels while maintaining sharp rendering
    this.context.setTransform(this.dpi, 0, 0, this.dpi, 0, 0);
  }

  /**
   * Set canvas to fill its parent container
   */
  private fitToParent(): void {
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.resize();
  }
}
