import FpsTracker from "./FpsTracker.js";

const TARGET_FPS = 120;

export default class AnimationController {
  constructor(onAnimateCallback) {
    this.frameRate = 1000 / TARGET_FPS;
    this.onAnimateCallback = onAnimateCallback;
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;
    this.fpsTracker = new FpsTracker();
  }

  start() {
    this.lastFrameTime = performance.now();
    this.fpsTracker = new FpsTracker();
    this.scheduleNextFrame();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate() {
    const now = performance.now();
    if (this.shouldUpdate(now)) {
      this.updateLastFrameTime(now);
      this.fpsTracker.incrementFrames(); // Increment frame count
      this.onAnimateCallback();
    }
    this.fpsTracker.update(now); // Update FPS
    this.scheduleNextFrame();
  }

  shouldUpdate(now) {
    const elapsedTime = now - this.lastFrameTime;
    return elapsedTime >= this.frameRate;
  }

  updateLastFrameTime(now) {
    const elapsedTime = now - this.lastFrameTime;
    this.lastFrameTime = now - (elapsedTime % this.frameRate);
  }

  scheduleNextFrame() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}
