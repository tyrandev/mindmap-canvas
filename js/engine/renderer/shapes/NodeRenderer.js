import LineMath from "../../math/LineMath.js";
import CollapseIndicator from "../../../model/indicators/CollapseIndicator.js";
import CollapseIndicatorRenderer from "../indicators/CollapseIndicatorRenderer.js";

export default class NodeRenderer {
  constructor(context) {
    this.context = context;
    this.collapseIndicatorRenderer = new CollapseIndicatorRenderer();
  }

  drawShapeWithText(node) {
    throw new Error("Method 'drawShapeWithText()' must be implemented.");
  }

  renderCollapseIndicator(node) {
    if (!(node.collapsed instanceof CollapseIndicator)) return;
    this.collapseIndicatorRenderer.drawCollapseIndicator(node);
  }

  drawNodeText(node) {
    this.setTextStyle(node);
    this.computeTextLines(node);
  }

  setTextStyle(node) {
    this.context.fillStyle = node.textColor;
    this.context.font = `${node.fontSize}px Arial`;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
  }

  computeTextLines(node) {
    throw new Error("Method 'computeTextLines()' must be implemented.");
  }

  connectLineToChildNodes(node, child) {
    this.connectWithCurvedLine(
      node.x,
      node.y,
      child.x,
      child.y,
      node.getLineColor()
    );
  }

  connectWithStraightLine(startX, startY, endX, endY) {
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
    this.context.closePath();
  }

  connectWithCurvedLine(startX, startY, endX, endY, lineColor) {
    const { controlX1, controlY1, controlX2, controlY2 } =
      LineMath.calculateControlPointsForCurvedLine(startX, startY, endX, endY);

    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.bezierCurveTo(
      controlX1,
      controlY1,
      controlX2,
      controlY2,
      endX,
      endY
    );
    this.context.strokeStyle = lineColor;
    this.context.stroke();
    this.context.closePath();
  }

  render(node) {
    if (node.hasCollapsedAncestor()) return;
    this.drawShapeWithText(node);
    if (!node.collapsed) {
      node.children.forEach((child) => {
        this.connectLineToChildNodes(node, child);
      });
    } else {
      this.renderCollapseIndicator(node);
    }
  }
}
