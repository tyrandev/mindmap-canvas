import CircleTextHelper from "./CircleTextHelper.js";
import Node from "../node/Node.js";
import * as CircleConstants from "../../../constants/CircleConstants.js";

export default class Circle extends Node {
  constructor(x = 0, y = 0) {
    super(x, y);
    this.radius = CircleConstants.BASE_CIRCLE_RADIUS;
    this.setText(this.text);
  }

  clone() {
    const clone = new Circle(this.x, this.y);
    clone.radius = this.radius;
    clone.text = this.text;
    clone.fillColor = this.fillColor;
    clone.borderColor = this.borderColor;
    clone.textColor = this.textColor;
    clone.borderWidth = this.borderWidth;
    clone.setId(this.id);
    clone.collapsed = this.collapsed;
    this.children.forEach((child) => {
      clone.addChildNode(child.clone());
    });
    return clone;
  }

  getRadius() {
    return this.radius;
  }

  isPointInsideOfNode(x, y) {
    const { dx, dy } = this.calculateDistanceDifferences(this.x, this.y, x, y);
    const squaredDistance = this.calculateSquaredDistance(dx, dy);
    return this.isDistanceWithinRadius(this.radius, squaredDistance);
  }

  calculateDistanceDifferences(circleX, circleY, x, y) {
    const dx = circleX - x;
    const dy = circleY - y;
    return { dx, dy };
  }

  calculateSquaredDistance(dx, dy) {
    return dx * dx + dy * dy;
  }

  isDistanceWithinRadius(radius, squaredDistance) {
    return squaredDistance <= radius * radius;
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

  setText(newText) {
    this.text = CircleTextHelper.limitTextCharacterNumber(newText);
    this.fontSize = CircleTextHelper.calculateFontSize(this.text, this.radius);
    if (isNaN(this.fontSize) || this.fontSize <= 0) {
      console.error(`Invalid fontSize calculated: ${this.fontSize}`);
      this.fontSize = CircleConstants.BASE_FONT_SIZE;
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      radius: this.radius,
    };
  }
}
