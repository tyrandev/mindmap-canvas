const FPS = 30;

export default class AnimationController {
  constructor(onAnimateCallback) {
    this.frameRate = 1000 / FPS;
    this.onAnimateCallback = onAnimateCallback;
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;
  }

  start() {
    this.lastFrameTime = performance.now();
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
      this.onAnimateCallback();
    }
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
