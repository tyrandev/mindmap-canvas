const TARGET_FPS = 30; // Target FPS

export default class AnimationController {
  constructor(onAnimateCallback) {
    this.frameRate = 1000 / TARGET_FPS;
    this.onAnimateCallback = onAnimateCallback;
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;

    this.frames = 0;
    this.startTime = performance.now();
    this.fps = 0;
  }

  start() {
    this.lastFrameTime = performance.now();
    this.startTime = performance.now(); // Record the start time
    this.frames = 0; // Reset frame count
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
      this.frames++;
      this.onAnimateCallback();
    }
    this.calculateFPS(now);
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

  calculateFPS(now) {
    const elapsed = now - this.startTime;
    if (elapsed > 1000) {
      // Update FPS every second
      this.fps = (this.frames / elapsed) * 1000; // Calculate FPS
      console.log(`Current FPS: ${Math.round(this.fps)}`);

      // Reset counters
      this.frames = 0;
      this.startTime = now;
    }
  }
}
