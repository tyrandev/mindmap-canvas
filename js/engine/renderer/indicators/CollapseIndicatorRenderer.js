import Canvas from "../../../view/Canvas.js";

export default class CollapseIndicatorRenderer {
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
    const indicator = node.collapsed;
    const textY = indicator.calculateHeightOfCollapseIndicator(node);
    this.context.fillText("(collapsed)", node.x, textY);
    this.context.restore();
  }
}
