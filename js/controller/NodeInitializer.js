import Circle from "../model/geometric/circle/Circle.js";
import * as CircleConstants from "../model/geometric/circle/CircleConstants.js";
import CenterUtil from "../util/canvas/CenterUtil.js";

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
      const rootNode = new Circle(
        x,
        y,
        CircleConstants.BASE_CIRCLE_RADIUS,
        initialText
      );
      this.addNode(rootNode);
      console.log("Root node is successfully initialized:", rootNode);
    } catch (error) {
      console.error("Error initializing root node:", error);
    }
  }
}
