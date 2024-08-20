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
    this.adjustFontSize();
  }

  get width() {
    return this.originalWidth;
  }

  set width(value) {
    this.originalWidth = value;
    this.addWidthBasedOnTextLength();
    this.adjustFontSize();
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
    this.adjustFontSize();
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
    this.adjustFontSize();
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

  adjustFontSize() {
    this.fontSize = this.height / 3;
    console.log("Font size adjusted to: ", this.fontSize);
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
      RectangleHelper.roundRect(
        context,
        this.x - currentWidth / 2,
        this.y - this.height / 2,
        currentWidth,
        this.height,
        this.cornerRadii
      );
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

  calculateConnectionPoints(child) {
    if (child instanceof Circle) {
      return this.calculateRectangleToCircleConnection(child);
    } else if (child instanceof Rectangle) {
      return this.calculateRectangleToRectangleConnection(child);
    } else {
      console.error("Unsupported child type for connection calculation.");
      return { startX: this.x, startY: this.y, endX: child.x, endY: child.y };
    }
  }

  calculateRectangleToCircleConnection(circle) {
    const dx = circle.x - this.x;
    const dy = circle.y - this.y;
    const angle = Math.atan2(dy, dx);
    const rectEdge = RectangleMath.getRectangleEdge(
      dx,
      dy,
      this.actualWidth,
      this.height,
      this.x,
      this.y
    );
    const circleEdge = this.getCircleEdge(circle, angle);

    return {
      startX: rectEdge.x,
      startY: rectEdge.y,
      endX: circleEdge.x,
      endY: circleEdge.y,
    };
  }

  calculateRectangleToRectangleConnection(rectangle) {
    const dx = rectangle.x - this.x;
    const dy = rectangle.y - this.y;
    const startEdge = RectangleMath.getRectangleEdge(
      dx,
      dy,
      this.actualWidth,
      this.height,
      this.x,
      this.y
    );
    const endEdge = RectangleMath.getRectangleEdgeForChild(
      rectangle,
      dx,
      dy,
      rectangle.x,
      rectangle.y
    );

    return {
      startX: startEdge.x,
      startY: startEdge.y,
      endX: endEdge.x,
      endY: endEdge.y,
    };
  }

  getCircleEdge(circle, angle) {
    const circleRadius = circle.radius;
    const edgeX = circle.x - Math.cos(angle) * circleRadius;
    const edgeY = circle.y - Math.sin(angle) * circleRadius;
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

  drawCollapseIndicator(context) {
    context.save();
    context.fillStyle = "black";
    context.font = "14px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    const textY = this.y - this.height / 2 - 11;
    context.fillText("(collapsed)", this.x, textY);
    context.restore();
  }

  drawNodeText(context) {
    context.fillStyle = this.textColor;
    context.font = `${this.fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const lineHeight = this.fontSize + 4;
    const lines = this.text.split("\n");
    lines.forEach((line, index) => {
      const y = this.y + (index - lines.length / 2 + 0.5) * lineHeight;
      context.fillText(line, this.x, y);
    });
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
}
