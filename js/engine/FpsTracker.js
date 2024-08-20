export default class FpsTracker {
  constructor() {
    this.frames = 0;
    this.startTime = performance.now();
    this.fps = 0;
  }

  update(now) {
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

  incrementFrames() {
    this.frames++;
  }
}
