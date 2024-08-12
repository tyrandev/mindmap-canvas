import PerformanceMonitor from "./PerformanceMonitor.js";

const INITIAL_FPS = 240;

export default class DrawingEngine {
  constructor(context, drawCallback) {
    this.context = context;
    this.drawCallback = drawCallback;
    this.animationFrameId = null;
    this.performanceMonitor = new PerformanceMonitor();
    this.frameRate = 1000 / INITIAL_FPS;
    this.start();
  }

  start() {
    this.lastFrameTime = performance.now();
    this.animate();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate() {
    const now = performance.now();
    const elapsedTime = now - this.lastFrameTime;

    if (elapsedTime >= this.performanceMonitor.frameRate) {
      this.lastFrameTime =
        now - (elapsedTime % this.performanceMonitor.frameRate);
      this.drawCallback(this.context);

      // Update performance metrics
      this.performanceMonitor.updateFrameTime(performance.now() - now);
      this.performanceMonitor.adjustFPS();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
