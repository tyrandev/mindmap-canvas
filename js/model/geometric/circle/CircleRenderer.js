import NodeRenderer from "../node/NodeRenderer.js";
import CircleMath from "../../../math/CircleMath.js";
import CircleTextHelper from "../circle/CircleTextHelper.js";
import Circle from "../circle/Circle.js";
import Rectangle from "../rectangle/Rectangle.js";
import * as CircleConstants from "../../../constants/CircleConstants.js";

export default class CircleRenderer extends NodeRenderer {
  drawShapeWithText(circle) {
    this.context.save();
    this.drawCircleShape(circle);
    this.drawNodeText(circle);
    this.drawCollapseIndicator(circle);
    this.context.restore();
  }

  drawCircleShape(circle) {
    this.context.save();
    this.context.beginPath();
    this.context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    this.context.fillStyle = circle.fillColor;
    this.context.fill();
    this.context.lineWidth = circle.borderWidth;
    this.context.strokeStyle = circle.borderColor;
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }

  calculateHeightOfCollapseIndicator(circle) {
    const textY = circle.y - circle.getRadius() - 10;
    return textY;
  }

  computeTextLines(circle) {
    const lines = CircleTextHelper.splitTextIntoLines(
      circle.text,
      circle.radius,
      circle.fontSize
    );
    lines.forEach((line, index) => {
      const lineHeight = circle.fontSize + 4;
      const y = circle.y + (index - lines.length / 2 + 0.5) * lineHeight;
      this.context.fillText(line, circle.x, y);
    });
  }

  connectLineToChildNodes(circle, child) {
    this.context.save();
    this.context.lineWidth = 1;
    const { startX, startY, endX, endY } = this.calculateConnectionPoints(
      circle,
      child
    );
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
  }

  calculateConnectionPoints(circle, child) {
    const angle = CircleMath.calculateAngle(
      circle.x,
      circle.y,
      child.x,
      child.y
    );
    if (child instanceof Circle) {
      return CircleMath.calculateCircleToCircleConnection(circle, child, angle);
    } else if (child instanceof Rectangle) {
      return CircleMath.calculateCircleToRectangleConnection(
        circle,
        child,
        angle
      );
    } else {
      throw new Error("Unknown or unsupported type of node child");
    }
  }
}
