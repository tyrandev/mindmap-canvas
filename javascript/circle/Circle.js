import TextCircleHelper from "./TextCircleHelper.js";

const BASE_CIRCLE_COLOR = "#FFFFE0"; // lightyellow

export default class Circle {
  static idCounter = 0;
  static BASE_CIRCLE_COLOR = BASE_CIRCLE_COLOR; // Define static property

  constructor(
    x = 0,
    y = 0,
    radius = 50,
    text = "New node",
    fillColor = BASE_CIRCLE_COLOR,
    borderColor = "black",
    textColor = "black",
    borderWidth = 1
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
    this.parent = null; // Parent reference
    this.collapsed = false;
    this.setText(text);
  }

  clone() {
    // Create a new Circle object with the same properties
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
    // Copy other properties
    clone.id = this.id;
    clone.toBeRemoved = this.toBeRemoved;
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

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  drawCircleWithText(context) {
    context.save(); // Save the current context state
    this.drawCircleShape(context);
    this.drawCircleText(context);
    context.restore(); // Restore the context state
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
    context.lineWidth = 1; // Set a fixed line width for the connector lines

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
    child.parent = this; // Ensure the parent is set
  }

  removeChildNode(child) {
    this.children = this.children.filter((c) => c !== child);
    child.parent = null; // Clear the parent reference
  }

  drawNodes(context) {
    this.drawCircleWithText(context);
    this.children.forEach((child) => {
      this.connectLineToChildCircles(context, child);
      child.drawNodes(context);
    });
  }

  actualiseText() {
    this.setText(this.text);
  }

  setText(newText) {
    this.text = TextCircleHelper.limitTextCharacterNumber(newText);
    this.fontSize = TextCircleHelper.calculateFontSize(this.text, this.radius);
  }

  setRadius(newRadius) {
    this.radius = newRadius;
    this.actualiseText();
  }
}
