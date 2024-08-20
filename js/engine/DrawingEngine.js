import PerformanceMonitor from "./PerformanceMonitor.js";
import CanvasGraphics from "./CanvasGraphics.js";
import NodeRenderer from "./NodeRenderer.js";

const INITIAL_FPS = 180;

export default class DrawingEngine {
  constructor(nodeContainer) {
    this.canvasGraphics = new CanvasGraphics();
    this.nodeRenderer = new NodeRenderer(nodeContainer);
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
      this.updateLastFrameTime(now, elapsedTime);
      this.clearAndRenderCanvas();
      this.updatePerformanceMetrics(now);
    }
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  updateLastFrameTime(now, elapsedTime) {
    this.lastFrameTime =
      now - (elapsedTime % this.performanceMonitor.frameRate);
  }

  clearAndRenderCanvas() {
    this.canvasGraphics.clearCanvas();
    this.nodeRenderer.drawNodes(this.canvasGraphics.getContext());
  }

  updatePerformanceMetrics(now) {
    const frameProcessingTime = performance.now() - now;
    this.performanceMonitor.updateFrameTime(frameProcessingTime);
    this.performanceMonitor.adjustFPS();
  }
}
