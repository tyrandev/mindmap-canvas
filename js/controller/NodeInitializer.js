import NodeFactory from "../util/factory/NodeFactory.js";
import Canvas from "../view/Canvas.js";

export default class NodeInitializer {
  constructor(controller) {
    this.controller = controller;
    this.rootNode = null; // Property to store the root node
  }

  initRootNode(initialText = "Mindmap") {
    if (this.rootNode) {
      console.warn("Root node is already initialized.");
      return;
    }
    this.initRootCircle(initialText);
  }

  initRootCircle(initialText) {
    try {
      const { x, y } = Canvas.getCenterCoordinates();
      this.rootNode = NodeFactory.createCircle(
        x,
        y,
        undefined,
        undefined,
        initialText
      );
      this.controller.putNodeIntoContainer(this.rootNode);
      console.log("Root node is successfully initialized:", this.rootNode);
    } catch (error) {
      console.error("Error initializing root node:", error);
    }
  }

  getRootNode() {
    if (!this.rootNode) {
      console.error("Root node has not been initialized yet.");
    }
    return this.rootNode;
  }

  reinitializeRootNode(initialText = "Mindmap") {
    if (this.rootNode) {
      this.controller.removeNode(this.rootNode);
      this.rootNode = null; // Clear the existing root node
    }
    this.initRootNode(initialText); // Reinitialize the root node
    console.log("Root node has been reinitialized.");
  }
}
