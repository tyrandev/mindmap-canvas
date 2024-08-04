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
    const centerX = CenterUtil.calculateCenterX();
    const centerY = CenterUtil.calculateCenterY();
    const rootNode = new Circle(
      centerX,
      centerY,
      CircleConstants.BASE_CIRCLE_RADIUS,
      initialText
    );
    this.controller.addNode(rootNode);
    console.log(rootNode);
  }
}
