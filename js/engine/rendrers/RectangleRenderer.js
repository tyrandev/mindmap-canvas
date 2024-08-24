import NodeRenderer from "../../engine/rendrers/NodeRenderer.js";
import RectangleMath from "../../math/RectangleMath.js";
import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";

export default class RectangleRenderer extends NodeRenderer {
  drawShapeWithText(rectangle) {
    this.context.save();
    this.drawRectangleShape(rectangle);
    this.drawNodeText(rectangle);
    this.drawCollapseIndicator(rectangle);
    this.context.restore();
  }

  drawRectangleShape(rectangle) {
    this.context.save();
    this.context.beginPath();

    if (rectangle.roundedCorners) {
      this.roundCorners(rectangle);
    } else {
      this.context.rect(
        rectangle.x - rectangle.actualWidth / 2,
        rectangle.y - rectangle.height / 2,
        rectangle.actualWidth,
        rectangle.height
      );
    }

    this.context.fillStyle = rectangle.fillColor;
    this.context.fill();
    this.context.lineWidth = rectangle.borderWidth;
    this.context.strokeStyle = rectangle.borderColor;
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }

  roundCorners(rectangle) {
    this.roundRect(
      rectangle.x - rectangle.actualWidth / 2,
      rectangle.y - rectangle.height / 2,
      rectangle.actualWidth,
      rectangle.height,
      rectangle.cornerRadii
    );
  }

  roundRect(x, y, width, height, radii) {
    const [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius] =
      RectangleMath.adjustRadii(width, height, radii);
    this.context.beginPath();
    this.context.moveTo(x + topLeftRadius, y);
    this.context.arcTo(x + width, y, x + width, y + height, topRightRadius);
    this.context.arcTo(x + width, y + height, x, y + height, bottomRightRadius);
    this.context.arcTo(x, y + height, x, y, bottomLeftRadius);
    this.context.arcTo(x, y, x + width, y, topLeftRadius);
    this.context.closePath();
  }

  calculateHeightOfCollapseIndicator(rectangle) {
    const textY = rectangle.y - rectangle.height / 2 - 11;
    return textY;
  }

  computeTextLines(rectangle) {
    const lineHeight = rectangle.fontSize + 4;
    const lines = rectangle.text.split("\n");
    lines.forEach((line, index) => {
      const y = rectangle.y + (index - lines.length / 2 + 0.5) * lineHeight;
      this.context.fillText(line, rectangle.x, y);
    });
  }

  connectLineToChildNodes(rectangle, child) {
    this.context.save();
    this.context.lineWidth = 1;
    const { startX, startY, endX, endY } = this.calculateConnectionPoints(
      rectangle,
      child
    );
    this.connectWithCurvedLine(startX, startY, endX, endY);
  }

  calculateConnectionPoints(rectangle, child) {
    if (child instanceof Circle) {
      return RectangleMath.calculateRectangleToCircleConnection(
        rectangle,
        child
      );
    } else if (child instanceof Rectangle) {
      return RectangleMath.calculateRectangleToRectangleConnection(
        rectangle,
        child
      );
    } else {
      throw new Error("Unknown or unsupported type of node child");
    }
  }
}
