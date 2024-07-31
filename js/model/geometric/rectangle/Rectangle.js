import Node from "../node/Node.js";
import Circle from "../circle/Circle.js";
import * as RectangleConstants from "./RectangleConstants.js";
import RectangleHelper from "./RectangleHelper.js";

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
    this.width = width;
    this.height = height;
    this.cornerRadii = cornerRadii;
    this.roundedCorners = roundedCorners;
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
      this.borderWidth,
      [...this.cornerRadii],
      this.roundedCorners
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

    if (this.roundedCorners) {
      RectangleHelper.roundRect(
        context,
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height,
        this.cornerRadii
      );
    } else {
      context.rect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
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
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const rectEdge = this.getRectangleEdge(dx, dy);
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

    const startEdge = this.getRectangleEdge(dx, dy);
    const endEdge = this.getRectangleEdgeForChild(rectangle, dx, dy);

    return {
      startX: startEdge.x,
      startY: startEdge.y,
      endX: endEdge.x,
      endY: endEdge.y,
    };
  }

  getRectangleEdge(dx, dy) {
    const rectHalfWidth = this.width / 2;
    const rectHalfHeight = this.height / 2;
    const aspectRatio = this.width / this.height;

    let edgeX, edgeY;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal edge
      if (Math.abs(dx) / Math.abs(dy) > aspectRatio) {
        edgeX = this.x + (dx > 0 ? rectHalfWidth : -rectHalfWidth);
        edgeY = this.y + (dy / Math.abs(dx)) * rectHalfWidth;
      } else {
        edgeY = this.y + (dy > 0 ? rectHalfHeight : -rectHalfHeight);
        edgeX = this.x + (dx / Math.abs(dy)) * rectHalfHeight;
      }
    } else {
      // Vertical edge
      if (Math.abs(dy) / Math.abs(dx) > aspectRatio) {
        edgeY = this.y + (dy > 0 ? rectHalfHeight : -rectHalfHeight);
        edgeX = this.x + (dx / Math.abs(dy)) * rectHalfHeight;
      } else {
        edgeX = this.x + (dx > 0 ? rectHalfWidth : -rectHalfWidth);
        edgeY = this.y + (dy / Math.abs(dx)) * rectHalfWidth;
      }
    }

    // Clamp to rectangle edges
    edgeX = Math.max(
      this.x - rectHalfWidth,
      Math.min(this.x + rectHalfWidth, edgeX)
    );
    edgeY = Math.max(
      this.y - rectHalfHeight,
      Math.min(this.y + rectHalfHeight, edgeY)
    );

    return { x: edgeX, y: edgeY };
  }

  getCircleEdge(circle, angle) {
    const circleRadius = circle.radius;
    const edgeX = circle.x - Math.cos(angle) * circleRadius;
    const edgeY = circle.y - Math.sin(angle) * circleRadius;

    return { x: edgeX, y: edgeY };
  }

  getRectangleEdgeForChild(child, dx, dy) {
    const childSlopeX = Math.abs(dx / child.width);
    const childSlopeY = Math.abs(dy / child.height);

    let endX, endY;
    if (childSlopeX > childSlopeY) {
      endX = child.x - (dx > 0 ? child.width / 2 : -child.width / 2);
      endY = child.y - ((dy / Math.abs(dx)) * child.width) / 2;
    } else {
      endY = child.y - (dy > 0 ? child.height / 2 : -child.height / 2);
      endX = child.x - ((dx / Math.abs(dy)) * child.height) / 2;
    }

    return { x: endX, y: endY };
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

  setText(newText) {
    if (newText.length > RectangleConstants.RECTANGLE_MAX_CHARACTERS) {
      newText = newText.substring(
        0,
        RectangleConstants.RECTANGLE_MAX_CHARACTERS
      );
    }
    this.text = newText;
    this.fontSize = this.height / 3;
    // this.adjustWidthBasedOnText();
  }

  adjustWidthBasedOnText() {
    const textLength = this.text.length;

    // Calculate new width based on text length
    if (textLength > 9) {
      this.width =
        RectangleConstants.BASE_RECTANGLE_WIDTH +
        (textLength - 9) * RectangleConstants.PIXELS_PER_CHARACTER;
      // Ensure the width does not exceed the maximum allowable width
      this.width = Math.min(
        this.width,
        RectangleConstants.BASE_RECTANGLE_WIDTH +
          (RectangleConstants.RECTANGLE_MAX_CHARACTERS - 9) *
            RectangleConstants.PIXELS_PER_CHARACTER
      );
    } else {
      this.width = RectangleConstants.BASE_RECTANGLE_WIDTH;
    }
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
}
