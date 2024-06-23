import TextCircleHelper from "./TextCircleHelper.js";

export default class Circle {
  static idCounter = 0;

  constructor(
    x = 400,
    y = 300,
    radius = 50,
    text = "New node",
    fillColor = "lightyellow",
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
    this.parent = null;

    this.setText(text);
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

  isPointInside(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  setBorderColor(newColor) {
    this.borderColor = newColor;
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
    child.parent = this;
  }

  removeChildNode(child) {
    this.children = this.children.filter((c) => c !== child);
  }

  drawNodes(context) {
    this.drawCircleWithText(context);
    this.children.forEach((child) => {
      this.connectLineToChildCircles(context, child);
      child.drawNodes(context);
    });
  }

  setText(newText) {
    this.text = TextCircleHelper.limitTextCharacterNumber(newText);
    this.fontSize = TextCircleHelper.calculateFontSize(this.text, this.radius);
  }
}
