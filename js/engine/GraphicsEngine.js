import CanvasGraphics from "./animation/CanvasGraphics.js";
import ContentRenderer from "./renderer/ContentRenderer.js";
import AnimationController from "./animation/AnimationController.js";

export default class GraphicsEngine {
  constructor(nodeContainer) {
    this.canvasGraphics = new CanvasGraphics();
    this.nodeRenderer = new ContentRenderer(nodeContainer);
    this.animationController = new AnimationController(
      this.onAnimate.bind(this)
    );
    this.start();
  }

  start() {
    this.animationController.start();
  }

  stop() {
    this.animationController.stop();
  }

  onAnimate() {
    this.clearAndRenderCanvas();
  }

  clearAndRenderCanvas() {
    this.canvasGraphics.clearCanvas();
    this.nodeRenderer.drawNodes();
  }
}
