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
    // Vector from rectangle to child (could be a circle or another rectangle)
    const dx = child.x - this.x;
    const dy = child.y - this.y;

    if (child instanceof Circle) {
      // Calculate the connection points for Rectangle to Circle
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Connection point on the rectangle's boundary
      const rectHalfWidth = this.width / 2;
      const rectHalfHeight = this.height / 2;

      let rectEdgeX, rectEdgeY;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal edge of the rectangle
        rectEdgeX = this.x + (dx > 0 ? rectHalfWidth : -rectHalfWidth);
        rectEdgeY = this.y + (dy / Math.abs(dx)) * rectHalfWidth;
      } else {
        // Vertical edge of the rectangle
        rectEdgeY = this.y + (dy > 0 ? rectHalfHeight : -rectHalfHeight);
        rectEdgeX = this.x + (dx / Math.abs(dy)) * rectHalfHeight;
      }

      // Connection point on the circle's boundary
      const circleRadius = child.radius;
      const circleEdgeX = child.x - Math.cos(angle) * circleRadius;
      const circleEdgeY = child.y - Math.sin(angle) * circleRadius;

      return {
        startX: rectEdgeX,
        startY: rectEdgeY,
        endX: circleEdgeX,
        endY: circleEdgeY,
      };
    } else if (child instanceof Rectangle) {
      // Existing logic for Rectangle to Rectangle
      // Calculate the slopes for this rectangle
      const slopeX = Math.abs(dx / this.width);
      const slopeY = Math.abs(dy / this.height);

      // Determine connection point on this rectangle
      let startX, startY;
      if (slopeX > slopeY) {
        startX = this.x + (dx > 0 ? this.width / 2 : -this.width / 2);
        startY = this.y + ((dy / Math.abs(dx)) * this.width) / 2;
      } else {
        startY = this.y + (dy > 0 ? this.height / 2 : -this.height / 2);
        startX = this.x + ((dx / Math.abs(dy)) * this.height) / 2;
      }

      // Calculate the slopes for the child rectangle
      const childSlopeX = Math.abs(dx / child.width);
      const childSlopeY = Math.abs(dy / child.height);

      // Determine connection point on the child rectangle
      let endX, endY;
      if (childSlopeX > childSlopeY) {
        endX = child.x - (dx > 0 ? child.width / 2 : -child.width / 2);
        endY = child.y - ((dy / Math.abs(dx)) * child.width) / 2;
      } else {
        endY = child.y - (dy > 0 ? child.height / 2 : -child.height / 2);
        endX = child.x - ((dx / Math.abs(dy)) * child.height) / 2;
      }

      return {
        startX,
        startY,
        endX,
        endY,
      };
    } else {
      console.error("Unsupported child type for connection calculation.");
      return { startX: this.x, startY: this.y, endX: child.x, endY: child.y };
    }
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
    this.text = newText;
    this.fontSize = this.width / 6.33;
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
