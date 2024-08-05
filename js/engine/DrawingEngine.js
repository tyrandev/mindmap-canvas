const FPS = 300;

export default class DrawingEngine {
  constructor(context, drawCallback) {
    this.context = context;
    this.drawCallback = drawCallback;
    this.animationFrameId = null;
    this.frameRate = 1000 / FPS;
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
    if (elapsedTime >= this.frameRate) {
      this.lastFrameTime = now - (elapsedTime % this.frameRate);
      this.drawCallback(this.context);
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  //TODO: fps should be decreased by class named PerformanceMonitor
}
