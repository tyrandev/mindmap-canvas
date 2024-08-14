import PerformanceMonitor from "./PerformanceMonitor.js";
import Canvas from "../view/Canvas.js";

const INITIAL_FPS = 180;

export default class DrawingEngine {
  constructor(nodeContainer) {
    this.context = Canvas.getContext();
    this.nodeContainer = nodeContainer;
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
      this.clearCanvas();
      this.drawCanvasNodes();

      // Update performance metrics
      this.performanceMonitor.updateFrameTime(performance.now() - now);
      this.performanceMonitor.adjustFPS();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  clearCanvas() {
    this.context.clearRect(
      0,
      0,
      Canvas.getCanvas().width,
      Canvas.getCanvas().height
    );
  }

  drawCanvasNodes() {
    this.nodeContainer
      .getNodes()
      .forEach((node) => node.drawNodes(this.context));
  }
}
