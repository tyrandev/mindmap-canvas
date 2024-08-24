import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import Circle from "../model/geometric/circle/Circle.js";

export default class CircleMath {
  static calculateConnectionPoints(thisCircle, child) {
    const dx = child.x - thisCircle.x;
    const dy = child.y - thisCircle.y;
    const angle = Math.atan2(dy, dx);

    if (child instanceof Circle) {
      return CircleMath.calculateCircleToCircleConnection(
        thisCircle,
        child,
        angle
      );
    } else if (child instanceof Rectangle) {
      return CircleMath.calculateCircleToRectangleConnection(
        thisCircle,
        child,
        angle
      );
    } else {
      throw new Error("Unknown or unsupported type of node child");
    }
  }

  static calculateCircleToCircleConnection(sourceCircle, targetCircle, angle) {
    const startX = CircleMath.getCircleEdge(sourceCircle, angle).x;
    const startY = CircleMath.getCircleEdge(sourceCircle, angle).y;
    const endX = CircleMath.getCircleEdge(targetCircle, angle + Math.PI).x;
    const endY = CircleMath.getCircleEdge(targetCircle, angle + Math.PI).y;
    return { startX, startY, endX, endY };
  }

  static calculateCircleToRectangleConnection(
    sourceCircle,
    targetRectangle,
    angle
  ) {
    const closestPoint = CircleMath.getClosestPointOnRectangle(
      targetRectangle,
      sourceCircle,
      angle
    );
    const startX = CircleMath.getCircleEdge(sourceCircle, angle).x;
    const startY = CircleMath.getCircleEdge(sourceCircle, angle).y;
    const endX = closestPoint.x;
    const endY = closestPoint.y;
    return { startX, startY, endX, endY };
  }

  static getCircleEdge(circle, angle) {
    if (!(circle instanceof Circle)) return;
    const edgeX = circle.x + Math.cos(angle) * circle.radius;
    const edgeY = circle.y + Math.sin(angle) * circle.radius;
    return { x: edgeX, y: edgeY };
  }

  static getClosestPointOnRectangle(targetRectangle, sourceCircle, angle) {
    const halfWidth = targetRectangle.width / 2;
    const halfHeight = targetRectangle.height / 2;

    // Determine which side of the rectangle to connect to
    const dx = sourceCircle.x - targetRectangle.x;
    const dy = sourceCircle.y - targetRectangle.y;

    let closestX, closestY;

    // Adjust the multiplier (e.g., 1.5) to favor horizontal connections
    if (Math.abs(dx) * 3.7 > Math.abs(dy)) {
      // Connect to the left or right side
      if (dx > 0) {
        closestX = targetRectangle.x + halfWidth;
        closestY = targetRectangle.y;
      } else {
        closestX = targetRectangle.x - halfWidth;
        closestY = targetRectangle.y;
      }
    } else {
      // Connect to the top or bottom side
      if (dy > 0) {
        closestX = targetRectangle.x;
        closestY = targetRectangle.y + halfHeight;
      } else {
        closestX = targetRectangle.x;
        closestY = targetRectangle.y - halfHeight;
      }
    }
    return { x: closestX, y: closestY };
  }

  static calculateAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.atan2(dy, dx);
  }

  static calculateDistanceDifferences(circleX, circleY, x, y) {
    const dx = circleX - x;
    const dy = circleY - y;
    return { dx, dy };
  }

  static calculateSquaredDistance(dx, dy) {
    return dx * dx + dy * dy;
  }

  static isDistanceWithinRadius(radius, squaredDistance) {
    return squaredDistance <= radius * radius;
  }
}
