import Rectangle from "../geometric/rectangle/Rectangle.js";
import Circle from "../geometric/circle/Circle.js";

export default class CollapseIndicator {
  calculateHeightOfCollapseIndicator(node) {
    if (node instanceof Rectangle) {
      return node.y - node.height / 2 - 11;
    } else if (node instanceof Circle) {
      return node.y - node.getRadius() - 10;
    } else {
      throw new Error("Unsupported format of node for collapse indicator.");
    }
  }

  toJSON() {
    return {
      type: "CollapseIndicator",
    };
  }

  static fromJSON(data) {
    return new CollapseIndicator();
  }
}
