import NodeFactory from "../util/factory/NodeFactory.js";
import Canvas from "../model/mindmap/Canvas.js";

export default class NodeInitializer {
  constructor(controller) {
    this.controller = controller;
  }

  initRootNode() {
    this.initRootCircle();
  }

  initRootCircle(initialText = "Mindmap") {
    try {
      const { x, y } = Canvas.getCenterCoordinates();
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
}
