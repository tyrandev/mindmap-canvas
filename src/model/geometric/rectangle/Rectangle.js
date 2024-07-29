import Node from "../node/Node.js";
import * as RectangleConstants from "./RectangleConstants.js";

export default class Rectangle extends Node {
  constructor(
    x = 0,
    y = 0,
    width = RectangleConstants.BASE_RECTANGLE_WIDTH,
    height = RectangleConstants.BASE_RECTANGLE_HEIGHT,
    text = RectangleConstants.NODE_DEFAULT_NAME,
    fillColor = RectangleConstants.BASE_RECTANGLE_COLOR,
    borderColor = "black",
    textColor = "black",
    borderWidth = RectangleConstants.BASE_RECTANGLE_BORDER_WIDTH
  ) {
    super(x, y, text, fillColor, borderColor, textColor, borderWidth);
    this.width = width;
    this.height = height;
    this.setText(text);
  }

  clone() {
    const clone = new Rectangle(
      this.x,
      this.y,
      this.width,
      this.height,
      this.text,
      this.fillColor,
      this.borderColor,
      this.textColor,
      this.borderWidth
    );
    clone.id = this.id;
    clone.toBeRemoved = this.toBeRemoved;
    clone.collapsed = this.collapsed;
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
    });
    return clone;
  }

  drawShapeWithText(context) {
    context.save();
    this.drawRectangleShape(context);
    this.drawNodeText(context);
    if (this.collapsed) {
      this.drawCollapseIndicator(context);
    }
    context.restore();
  }

  drawRectangleShape(context) {
    context.save();
    context.beginPath();
    context.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.fillStyle = this.fillColor;
    context.fill();
    context.lineWidth = this.borderWidth;
    context.strokeStyle = this.borderColor;
    context.stroke();
    context.closePath();
    context.restore();
  }

  connectLineToChildNodes(context, child) {
    context.save();
    context.lineWidth = 1;
    const { startX, startY, endX, endY } =
      this.calculateConnectionPoints(child);
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
    context.restore();
  }

  calculateConnectionPoints(child) {
    const dx = child.x - this.x;
    const dy = child.y - this.y;
    const angle = Math.atan2(dy, dx);
    const startX = this.x + (Math.cos(angle) * this.width) / 2;
    const startY = this.y + (Math.sin(angle) * this.height) / 2;
    const endX = child.x - (Math.cos(angle) * child.width) / 2;
    const endY = child.y - (Math.sin(angle) * child.height) / 2;
    return { startX, startY, endX, endY };
  }

  getRadius() {
    return Math.max(this.width, this.height) / 2;
  }

  isPointInsideOfNode(x, y) {
    return (
      x >= this.x - this.width / 2 &&
      x <= this.x + this.width / 2 &&
      y >= this.y - this.height / 2 &&
      y <= this.y + this.height / 2
    );
  }

  setDimensions(newWidth, newHeight) {
    if (isNaN(newWidth) || isNaN(newHeight)) {
      console.error(`Invalid dimensions: ${newWidth}, ${newHeight}`);
      return;
    }
    this.width = newWidth;
    this.height = newHeight;
    this.setText(this.text);
  }
}
