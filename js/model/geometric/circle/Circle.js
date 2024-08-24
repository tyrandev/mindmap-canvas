import CircleTextHelper from "../circle/CircleTextHelper.js";
import Node from "../node/Node.js";
import Rectangle from "../rectangle/Rectangle.js";
import * as CircleConstants from "../../../constants/CircleConstants.js";
import CircleMath from "../../../math/CircleMath.js";
import CircleRenderer from "./CircleRenderer.js";

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
    this.children.forEach((child) => {
      clone.addChildNode(child.clone());
    });

    return clone;
  }

  drawShapeWithText(context) {
    context.save();
    this.drawCircleShape(context);
    this.drawNodeText(context);
    this.drawCollapseIndicator(context);
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
    const angle = CircleMath.calculateAngle(this.x, this.y, child.x, child.y);
    if (child instanceof Circle) {
      return CircleMath.calculateCircleToCircleConnection(this, child, angle);
    } else if (child instanceof Rectangle) {
      return CircleMath.calculateCircleToRectangleConnection(
        this,
        child,
        angle
      );
    } else {
      throw new Error("Uknown or unsupported type of node child");
    }
  }

  getRadius() {
    return this.radius;
  }

  isPointInsideOfNode(x, y) {
    const { dx, dy } = CircleMath.calculateDistanceDifferences(
      this.x,
      this.y,
      x,
      y
    );
    const squaredDistance = CircleMath.calculateSquaredDistance(dx, dy);
    return CircleMath.isDistanceWithinRadius(this.radius, squaredDistance);
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

  calculateHeightOfCollapseIndicator() {
    const textY = this.y - this.getRadius() - 10;
    return textY;
  }

  computeTextLines(context) {
    const lines = CircleTextHelper.splitTextIntoLines(
      this.text,
      this.radius,
      this.fontSize
    );
    lines.forEach((line, index) => {
      const lineHeight = this.fontSize + 4;
      const y = this.y + (index - lines.length / 2 + 0.5) * lineHeight;
      context.fillText(line, this.x, y);
    });
  }

  setText(newText) {
    this.text = CircleTextHelper.limitTextCharacterNumber(newText);
    this.fontSize = CircleTextHelper.calculateFontSize(this.text, this.radius);
    if (isNaN(this.fontSize) || this.fontSize <= 0) {
      console.error(`Invalid fontSize calculated: ${this.fontSize}`);
      this.fontSize = CircleConstants.BASE_FONT_SIZE;
    }
  }

  render(context) {
    const renderer = new CircleRenderer(context);
    renderer.render(this);
  }
}
