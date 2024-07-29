import Node from "./Node.js";
import * as CircleConstants from "./CircleConstants.js";

export default class Circle extends Node {
  constructor(
    x = 0,
    y = 0,
    radius = CircleConstants.BASE_CIRCLE_RADIUS,
    text = CircleConstants.CIRCLE_DEFAULT_NAME,
    fillColor = CircleConstants.BASE_CIRCLE_COLOR,
    borderColor = "black",
    textColor = "black",
    borderWidth = CircleConstants.BASE_CIRCLE_WIDTH
  ) {
    super(x, y, text, fillColor, borderColor, textColor, borderWidth);
    this.radius = radius;
    this.setText(text);
  }

  clone() {
    const clone = new Circle(
      this.x,
      this.y,
      this.radius,
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
    this.drawCircleShape(context);
    this.drawNodeText(context);
    if (this.collapsed) {
      this.drawCollapseIndicator(context);
    }
    context.restore();
  }

  drawCircleShape(context) {
    context.save();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
    const startX = this.x + Math.cos(angle) * this.radius;
    const startY = this.y + Math.sin(angle) * this.radius;
    const endX = child.x - Math.cos(angle) * child.radius;
    const endY = child.y - Math.sin(angle) * child.radius;
    return { startX, startY, endX, endY };
  }

  getRadius() {
    return this.radius;
  }

  isPointInsideOfNode(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  setRadius(newRadius) {
    if (isNaN(newRadius)) {
      console.error(`Invalid radius value: ${newRadius}. Must be a number.`);
      return;
    }
    if (newRadius < CircleConstants.MIN_CIRCLE_RADIUS) {
      newRadius = CircleConstants.MIN_CIRCLE_RADIUS;
    }
    this.radius = newRadius;
    this.setText(this.text);
  }
}
