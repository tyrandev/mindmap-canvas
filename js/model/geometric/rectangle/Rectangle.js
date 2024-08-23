import Node from "../node/Node.js";
import Circle from "../circle/Circle.js";
import * as RectangleConstants from "../../../constants/RectangleConstants.js";
import RectangleHelper from "./RectangleHelper.js";
import RectangleMath from "./RectangleMath.js";

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
    borderWidth = RectangleConstants.BASE_RECTANGLE_BORDER_WIDTH,
    cornerRadii = [2, 2, 2, 2], // [top-left, top-right, bottom-right, bottom-left]
    roundedCorners = true
  ) {
    super(x, y, text, fillColor, borderColor, textColor, borderWidth);
    this.originalWidth = width;
    this.height = height;
    this.cornerRadii = cornerRadii;
    this.roundedCorners = roundedCorners;
    this.additionalWidth = 0;
    this.setText(text);
    this.calculateFontSize();
  }

  clone() {
    const clone = new Rectangle(
      this.x,
      this.y,
      this.originalWidth,
      this.height,
      this.text,
      this.fillColor,
      this.borderColor,
      this.textColor,
      this.borderWidth,
      [...this.cornerRadii],
      this.roundedCorners
    );
    clone.id = this.id;
    clone.collapsed = this.collapsed;
    this.children.forEach((child) => {
      const childClone = child.clone();
      clone.addChildNode(childClone);
    });
    return clone;
  }

  get width() {
    return this.originalWidth;
  }

  set width(value) {
    this.originalWidth = value;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  get actualWidth() {
    return this.originalWidth + this.additionalWidth;
  }

  setDimensions(newWidth, newHeight) {
    console.log(`Old Width: ${this.originalWidth}, New Width: ${newWidth}`);
    console.log(`Old Height: ${this.height}, New Height: ${newHeight}`);
    this.originalWidth = newWidth;
    this.height = newHeight;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  setText(newText) {
    if (newText.length > RectangleConstants.RECTANGLE_MAX_CHARACTERS) {
      newText = newText.substring(
        0,
        RectangleConstants.RECTANGLE_MAX_CHARACTERS
      );
    }
    this.text = newText;
    this.addWidthBasedOnTextLength();
    this.calculateFontSize();
  }

  addWidthBasedOnTextLength() {
    const countLettersAndNumbers = this.text.replace(
      /[^a-zA-Z0-9]/g,
      ""
    ).length;
    if (countLettersAndNumbers > 12) {
      this.additionalWidth = Math.max(
        0,
        (countLettersAndNumbers - 12) * RectangleConstants.PIXELS_PER_CHARACTER
      );
      console.log("additional width: ", this.additionalWidth);
    } else {
      this.additionalWidth = 0;
    }
  }

  calculateFontSize() {
    let baseFontSize = this.height / 2.99;
    let k = 0.0014;
    this.fontSize = baseFontSize / (1 + k * this.width);
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

    const currentWidth = this.actualWidth;

    if (this.roundedCorners) {
      this.roundCorners(context);
    } else {
      context.rect(
        this.x - currentWidth / 2,
        this.y - this.height / 2,
        currentWidth,
        this.height
      );
    }

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

  roundCorners(context) {
    const currentWidth = this.actualWidth;
    RectangleHelper.roundRect(
      context,
      this.x - currentWidth / 2,
      this.y - this.height / 2,
      currentWidth,
      this.height,
      this.cornerRadii
    );
  }

  calculateConnectionPoints(child) {
    if (child instanceof Circle) {
      return RectangleMath.calculateRectangleToCircleConnection(this, child);
    } else if (child instanceof Rectangle) {
      return RectangleMath.calculateRectangleToRectangleConnection(this, child);
    } else {
      throw new Error("Uknown or unsupported type of node child");
    }
  }

  getCircleEdge(targetCircle, angle) {
    if (!(targetCircle instanceof Circle)) return;
    const circleRadius = targetCircle.radius;
    const edgeX = targetCircle.x - Math.cos(angle) * circleRadius;
    const edgeY = targetCircle.y - Math.sin(angle) * circleRadius;
    return { x: edgeX, y: edgeY };
  }

  isPointInsideOfNode(x, y) {
    return (
      x >= this.x - this.actualWidth / 2 &&
      x <= this.x + this.actualWidth / 2 &&
      y >= this.y - this.height / 2 &&
      y <= this.y + this.height / 2
    );
  }

  calculateHeightOfCollapseIndicator() {
    const textY = this.y - this.height / 2 - 11;
    return textY;
  }

  drawNodeText(context) {
    this.setTextStyle(context);
    this.computeTextLines(context);
  }

  computeTextLines(context) {
    const lineHeight = this.fontSize + 4;
    const lines = this.text.split("\n");
    lines.forEach((line, index) => {
      const y = this.y + (index - lines.length / 2 + 0.5) * lineHeight;
      context.fillText(line, this.x, y);
    });
  }
}
