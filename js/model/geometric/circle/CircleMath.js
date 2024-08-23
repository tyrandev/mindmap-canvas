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
      throw new Error("Uknown or unsupported type of node child");
    }
  }

  static calculateCircleToCircleConnection(sourceCircle, targetCircle, angle) {
    const startX = sourceCircle.x + Math.cos(angle) * sourceCircle.radius;
    const startY = sourceCircle.y + Math.sin(angle) * sourceCircle.radius;
    const endX = targetCircle.x - Math.cos(angle) * targetCircle.radius;
    const endY = targetCircle.y - Math.sin(angle) * targetCircle.radius;
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
    const startX = sourceCircle.x + Math.cos(angle) * sourceCircle.radius;
    const startY = sourceCircle.y + Math.sin(angle) * sourceCircle.radius;
    const endX = closestPoint.x;
    const endY = closestPoint.y;
    return { startX, startY, endX, endY };
  }

  static getClosestPointOnRectangle(rectangle, circle, angle) {
    const halfWidth = rectangle.width / 2;
    const halfHeight = rectangle.height / 2;

    const closestX = Math.max(
      rectangle.x - halfWidth,
      Math.min(
        circle.x + Math.cos(angle) * circle.radius,
        rectangle.x + halfWidth
      )
    );
    const closestY = Math.max(
      rectangle.y - halfHeight,
      Math.min(
        circle.y + Math.sin(angle) * circle.radius,
        rectangle.y + halfHeight
      )
    );

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
