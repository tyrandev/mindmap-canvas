import NodeFactory from "./NodeFactory.js";
import CenterUtil from "../util/canvas/CenterUtil.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";

export default class NodeInitializer {
  constructor(controller) {
    this.controller = controller;
  }

  initRootNode() {
    this.initRootCircle();
    console.log("Root node is initialized.");
  }

  initRootCircle(initialText = "Mindmap") {
    try {
      const x = CenterUtil.calculateCenterX();
      const y = CenterUtil.calculateCenterY();
      const rootNode = NodeFactory.createCircle(
        x,
        y,
        CircleConstants.BASE_CIRCLE_RADIUS,
        initialText
      );
      this.controller.addNode(rootNode);
      console.log("Root node is successfully initialized:", rootNode);
    } catch (error) {
      console.error("Error initializing root node:", error);
    }
  }
}
