import CanvasGraphics from "./CanvasGraphics.js";
import NodeRenderer from "./NodeRenderer.js";
import AnimationController from "./AnimationController.js";

export default class DrawingEngine {
  constructor(nodeContainer) {
    this.canvasGraphics = new CanvasGraphics();
    this.nodeRenderer = new NodeRenderer(nodeContainer);
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
    this.nodeRenderer.drawNodes(this.canvasGraphics.getContext());
  }
}
