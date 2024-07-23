import TextCircleHelper from "./helper/TextCircleHelper.js";
import * as CircleConstants from "./CircleConstants.js";

export default class Circle {
  static idCounter = 0;

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
    this.id = Circle.idCounter++;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fillColor = fillColor;
    this.borderColor = borderColor;
    this.textColor = textColor;
    this.borderWidth = borderWidth;
    this.children = [];
    this.parent = null;
    this.collapsed = false;
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
      CircleConstants.BASE_CIRCLE_WIDTH
    );
    // Copy other properties
    clone.id = this.id;
    clone.toBeRemoved = this.toBeRemoved;
    clone.collapsed = this.collapsed;
    // Recreate the children relationship
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
    });
    return clone;
  }

  setCollapsed(collapsed) {
    this.collapsed = collapsed;
  }

  hasChildren() {
    return this.children.length > 0;
  }

  getText() {
    return this.text;
  }

  toggleCollapse() {
    if (!this.hasChildren()) return;
    this.collapsed = !this.collapsed;
  }

  drawCircleWithText(context) {
    context.save();
    this.drawCircleShape(context);
    this.drawCircleText(context);
    if (this.collapsed) {
      this.drawCollapseIndicator(context);
    }
    context.restore();
  }

  drawCircleShape(context) {
    context.save(); // Save the current context state

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.fillColor;
    context.fill();
    context.lineWidth = this.borderWidth;
    context.strokeStyle = this.borderColor;
    context.stroke();
    context.closePath();

    context.restore(); // Restore the context state
  }

  drawCircleText(context) {
    const lines = TextCircleHelper.splitTextIntoLines(
      this.text,
      this.radius,
      this.fontSize
    );

    context.fillStyle = this.textColor;
    context.font = `${this.fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    lines.forEach((line, index) => {
      const lineHeight = this.fontSize + 4;
      const y = this.y + (index - lines.length / 2 + 0.5) * lineHeight;
      context.fillText(line, this.x, y);
    });
  }

  drawCollapseIndicator(context) {
    context.save(); // Save the current context state
    // Draw the "(collapsed)" text at the top of the circle
    context.fillStyle = "black"; // Color of the "(collapsed)" text
    context.font = `${this.fontSize / 1.1}px Arial`;
    context.textAlign = "center"; // Center the text horizontally
    context.textBaseline = "middle"; // Center the text vertically
    // Adjust the y position to be slightly above the top of the circle
    const textY = this.y - this.radius - this.fontSize / 2;
    context.fillText("(collapsed)", this.x, textY); // Draw the text
    context.restore(); // Restore the context state
  }

  isPointInsideOfCircle(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  setBorderColor(newColor) {
    this.borderColor = newColor;
  }

  setFillColor(newColor) {
    this.fillColor = newColor;
  }

  getFillColor() {
    return this.fillColor;
  }

  connectLineToChildCircles(context, child) {
    context.save(); // Save the current context state
    context.lineWidth = 1;
    const { startX, startY, endX, endY } =
      this.calculateConnectionPoints(child);
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    context.closePath();
    context.restore(); // Restore the context state
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

  addChildNode(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChildNode(child) {
    this.children = this.children.filter((c) => c !== child);
    child.parent = null;
  }

  hasCollapsedAncestor() {
    let currentNode = this;
    while (currentNode.parent) {
      if (currentNode.parent.collapsed) {
        return true;
      }
      currentNode = currentNode.parent;
    }
    return false;
  }

  drawNodes(context) {
    if (this.hasCollapsedAncestor()) {
      return;
    }

    this.drawCircleWithText(context);
    if (!this.collapsed) {
      this.children.forEach((child) => {
        this.connectLineToChildCircles(context, child);
        child.drawNodes(context);
      });
    }
  }

  actualiseText() {
    this.setText(this.text);
  }

  setText(newText) {
    this.text = TextCircleHelper.limitTextCharacterNumber(newText);
    this.fontSize = TextCircleHelper.calculateFontSize(this.text, this.radius);
    if (isNaN(this.fontSize) || this.fontSize <= 0) {
      console.error(`Invalid fontSize calculated: ${this.fontSize}`);
      this.fontSize = CircleConstants.BASE_FONT_SIZE;
    }
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
    this.actualiseText();
  }
}
