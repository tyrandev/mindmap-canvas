const MIN_FPS = 30;
const MAX_FPS = 180;
const ADJUSTMENT_INTERVAL = 1000;

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
      const averageFrameTime = this.calculateAverageFrameTime();
      const newFPS = this.calculateNewFPS(averageFrameTime);

      this.updateFPS(newFPS);
      this.resetFrameMetrics(now);
    }
  }

  calculateAverageFrameTime() {
    return this.totalFrameTime / this.frameCount;
  }

  calculateNewFPS(averageFrameTime) {
    return Math.max(
      MIN_FPS,
      Math.min(MAX_FPS, Math.round(1000 / averageFrameTime))
    );
  }

  updateFPS(newFPS) {
    if (newFPS !== this.fps) {
      console.log(`FPS adjusted from ${this.fps} to ${newFPS}`);
      this.fps = newFPS;
    }
  }

  resetFrameMetrics(now) {
    this.totalFrameTime = 0;
    this.frameCount = 0;
    this.lastAdjustmentTime = now;
  }

  get frameRate() {
    return 1000 / this.fps;
  }
}
