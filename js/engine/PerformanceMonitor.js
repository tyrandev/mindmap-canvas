const MIN_FPS = 10;
const MAX_FPS = 240;
const ADJUSTMENT_INTERVAL = 1000; // Adjust FPS every second

export default class PerformanceMonitor {
  constructor() {
    this.lastAdjustmentTime = performance.now();
    this.totalFrameTime = 0;
    this.frameCount = 0;
    this.fps = MAX_FPS;
  }

  updateFrameTime(frameTime) {
    this.totalFrameTime += frameTime;
    this.frameCount++;
  }

  adjustFPS() {
    const now = performance.now();
    if (now - this.lastAdjustmentTime >= ADJUSTMENT_INTERVAL) {
      // Calculate average frame time
      const averageFrameTime = this.totalFrameTime / this.frameCount;

      // Calculate new FPS
      const newFPS = Math.max(
        MIN_FPS,
        Math.min(MAX_FPS, Math.round(1000 / averageFrameTime))
      );

      // Update FPS if changed
      if (newFPS !== this.fps) {
        console.log(`FPS adjusted from ${this.fps} to ${newFPS}`);
        this.fps = newFPS;
      }

      // Reset for next interval
      this.totalFrameTime = 0;
      this.frameCount = 0;
      this.lastAdjustmentTime = now;
    }
  }

  get frameRate() {
    return 1000 / this.fps;
  }
}
