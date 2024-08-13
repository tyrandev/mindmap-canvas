import NodeFactory from "../util/factory/NodeFactory.js";
import Canvas from "../model/mindmap/Canvas.js"; // Import Canvas class

export default class NodeInitializer {
  constructor(controller) {
    this.controller = controller;
  }

  initRootNode() {
    this.initRootCircle();
  }

  initRootCircle(initialText = "Mindmap") {
    try {
      const { x, y } = this.getCanvasCenterCoordinates();
      const rootNode = NodeFactory.createCircle(
        x,
        y,
        undefined,
        undefined,
        initialText
      );
      this.controller.addNode(rootNode);
      console.log("Root node is successfully initialized:", rootNode);
    } catch (error) {
      console.error("Error initializing root node:", error);
    }
  }

  getCanvasCenterCoordinates() {
    const canvas = Canvas.getCanvas();
    if (!canvas) {
      throw new Error("Canvas has not been initialized.");
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  }
}
