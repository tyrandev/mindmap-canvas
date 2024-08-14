import Node from "../node/Node.js";
import Rectangle from "../rectangle/Rectangle.js";
import * as CircleConstants from "./CircleConstants.js";

export default class Circle extends Node {
  constructor(
    x = 0,
    y = 0,
    radius = CircleConstants.BASE_CIRCLE_RADIUS,
    text = CircleConstants.NODE_DEFAULT_NAME,
    fillColor = CircleConstants.BASE_NODE_COLOR,
    borderColor = "black",
    textColor = "black",
    borderWidth = CircleConstants.BASE_NODE_BORDER_WITH
  ) {
    super(x, y, text, fillColor, borderColor, textColor, borderWidth);
    this.radius = radius;
    this.setText(text);
  }

  clone() {
    // Create a new instance of Node with the same properties
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

    clone.setId(this.id);
    clone.collapsed = this.collapsed;

    // Clone children and add to the cloned node
    this.children.forEach((child) => {
      clone.addChildNode(child.clone());
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

    if (child instanceof Circle) {
      return this.calculateConnectionToCircle(child, angle);
    } else if (child instanceof Rectangle) {
      return this.calculateConnectionToRectangle(child, angle);
    } else {
      console.error("Unsupported child type for connection calculation.");
      return { startX: this.x, startY: this.y, endX: child.x, endY: child.y };
    }
  }

  calculateConnectionToCircle(otherCircle, angle) {
    const startX = this.x + Math.cos(angle) * this.radius;
    const startY = this.y + Math.sin(angle) * this.radius;
    const endX = otherCircle.x - Math.cos(angle) * otherCircle.radius;
    const endY = otherCircle.y - Math.sin(angle) * otherCircle.radius;

    return { startX, startY, endX, endY };
  }

  calculateConnectionToRectangle(rectangle, angle) {
    const closestPoint = this.getClosestPointOnRectangle(rectangle, angle);
    const startX = this.x + Math.cos(angle) * this.radius;
    const startY = this.y + Math.sin(angle) * this.radius;
    const endX = closestPoint.x;
    const endY = closestPoint.y;

    return { startX, startY, endX, endY };
  }

  getClosestPointOnRectangle(rectangle, angle) {
    const halfWidth = rectangle.width / 2;
    const halfHeight = rectangle.height / 2;

    const closestX = Math.max(
      rectangle.x - halfWidth,
      Math.min(this.x + Math.cos(angle) * this.radius, rectangle.x + halfWidth)
    );
    const closestY = Math.max(
      rectangle.y - halfHeight,
      Math.min(this.y + Math.sin(angle) * this.radius, rectangle.y + halfHeight)
    );

    return { x: closestX, y: closestY };
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
