import CanvasGraphics from "./CanvasGraphics.js";
import ContentRenderer from "./ContentRenderer.js";
import AnimationController from "./AnimationController.js";

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
