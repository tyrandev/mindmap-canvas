export default class FpsTracker {
  constructor() {
    this.frames = 0;
    this.startTime = performance.now();
    this.fps = 0;
  }

  calculateFps(elapsed) {
    return (this.frames / elapsed) * 1000;
  }

  logFps() {
    // console.log(`Current FPS: ${Math.round(this.fps)}`);
  }

  resetCounters(now) {
    this.frames = 0;
    this.startTime = now;
  }

  update(now) {
    const elapsed = now - this.startTime;
    if (elapsed > 1000) {
      this.fps = this.calculateFps(elapsed);
      this.logFps();
      this.resetCounters(now);
    }
  }

  incrementFrames() {
    this.frames++;
  }
}
