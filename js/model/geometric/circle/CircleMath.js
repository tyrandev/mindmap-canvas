export default class CircleMath {
  static calculateConnectionPoints(thisCircle, child) {
    const dx = child.x - thisCircle.x;
    const dy = child.y - thisCircle.y;
    const angle = Math.atan2(dy, dx);

    if (child instanceof Circle) {
      return CircleMath.calculateConnectionToCircle(thisCircle, child, angle);
    } else if (child instanceof Rectangle) {
      return CircleMath.calculateConnectionToRectangle(
        thisCircle,
        child,
        angle
      );
    } else {
      console.error("Unsupported child type for connection calculation.");
      return {
        startX: thisCircle.x,
        startY: thisCircle.y,
        endX: child.x,
        endY: child.y,
      };
    }
  }

  static calculateConnectionToCircle(thisCircle, otherCircle, angle) {
    const startX = thisCircle.x + Math.cos(angle) * thisCircle.radius;
    const startY = thisCircle.y + Math.sin(angle) * thisCircle.radius;
    const endX = otherCircle.x - Math.cos(angle) * otherCircle.radius;
    const endY = otherCircle.y - Math.sin(angle) * otherCircle.radius;
    return { startX, startY, endX, endY };
  }

  static calculateConnectionToRectangle(thisCircle, rectangle, angle) {
    const closestPoint = CircleMath.getClosestPointOnRectangle(
      rectangle,
      thisCircle,
      angle
    );
    const startX = thisCircle.x + Math.cos(angle) * thisCircle.radius;
    const startY = thisCircle.y + Math.sin(angle) * thisCircle.radius;
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

  static calculateDifferences(circleX, circleY, x, y) {
    const dx = circleX - x;
    const dy = circleY - y;
    return { dx, dy };
  }

  static calculateSquaredDistance(dx, dy) {
    return dx * dx + dy * dy;
  }
}
