import Canvas from "../../view/Canvas.js";
import Rectangle from "../geometric/rectangle/Rectangle.js";
import Circle from "../geometric/circle/Circle.js";

export default class CollapseIndicator {
  constructor() {
    this.context = Canvas.getContext();
  }

  drawCollapseIndicator(node) {
    if (!node.collapsed) return;
    this.context.save();
    this.context.fillStyle = "black";
    this.context.font = "14px Arial";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    const textY = this.calculateHeightOfCollapseIndicator(node);
    this.context.fillText("(collapsed)", node.x, textY);
    this.context.restore();
  }

  calculateHeightOfCollapseIndicator(node) {
    if (node instanceof Rectangle) {
      const textY = node.y - node.height / 2 - 11;
      return textY;
    } else if (node instanceof Circle) {
      const textY = node.y - node.getRadius() - 10;
      return textY;
    } else {
      throw new Error("unsupported format of node for collapse indicator.");
    }
  }

  toJSON() {
    return {
      type: "CollapseIndicator",
    };
  }
}
