import Rectangle from "../model/geometric/rectangle/Rectangle.js";
import Circle from "../model/geometric/circle/Circle.js";

export default class RectangleMath {
  static adjustRadii(width, height, radii) {
    let [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius] =
      radii;

    if (width < 2 * topLeftRadius) topLeftRadius = width / 2;
    if (height < 2 * topLeftRadius) topLeftRadius = height / 2;

    if (width < 2 * topRightRadius) topRightRadius = width / 2;
    if (height < 2 * topRightRadius) topRightRadius = height / 2;

    if (width < 2 * bottomRightRadius) bottomRightRadius = width / 2;
    if (height < 2 * bottomRightRadius) bottomRightRadius = height / 2;

    if (width < 2 * bottomLeftRadius) bottomLeftRadius = width / 2;
    if (height < 2 * bottomLeftRadius) bottomLeftRadius = height / 2;

    return [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius];
  }

  static getRectangleEdge(dx, dy, width, height, x, y) {
    const rectHalfWidth = width / 2;
    const rectHalfHeight = height / 2;
    const aspectRatio = width / height;

    let edgeX, edgeY;
    if (Math.abs(dx) > Math.abs(dy)) {
      [edgeX, edgeY] = RectangleMath.calculateHorizontalEdge(
        dx,
        dy,
        aspectRatio,
        rectHalfWidth,
        rectHalfHeight,
        x,
        y
      );
    } else {
      [edgeX, edgeY] = RectangleMath.calculateVerticalEdge(
        dx,
        dy,
        aspectRatio,
        rectHalfWidth,
        rectHalfHeight,
        x,
        y
      );
    }

    return RectangleMath.clampToRectangleEdges(
      edgeX,
      edgeY,
      rectHalfWidth,
      rectHalfHeight,
      x,
      y
    );
  }

  static getCircleEdge(targetCircle, angle) {
    if (!(targetCircle instanceof Circle)) return;
    const circleRadius = targetCircle.radius;
    const edgeX = targetCircle.x - Math.cos(angle) * circleRadius;
    const edgeY = targetCircle.y - Math.sin(angle) * circleRadius;
    return { x: edgeX, y: edgeY };
  }

  static calculateHorizontalEdge(
    dx,
    dy,
    aspectRatio,
    rectHalfWidth,
    rectHalfHeight,
    x,
    y
  ) {
    let edgeX, edgeY;
    if (Math.abs(dx) / Math.abs(dy) > aspectRatio) {
      edgeX = x + (dx > 0 ? rectHalfWidth : -rectHalfWidth);
      edgeY = y + (dy / Math.abs(dx)) * rectHalfWidth;
    } else {
      edgeY = y + (dy > 0 ? rectHalfHeight : -rectHalfHeight);
      edgeX = x + (dx / Math.abs(dy)) * rectHalfHeight;
    }
    return [edgeX, edgeY];
  }

  static calculateVerticalEdge(
    dx,
    dy,
    aspectRatio,
    rectHalfWidth,
    rectHalfHeight,
    x,
    y
  ) {
    let edgeX, edgeY;
    if (Math.abs(dy) / Math.abs(dx) > aspectRatio) {
      edgeY = y + (dy > 0 ? rectHalfHeight : -rectHalfHeight);
      edgeX = x + (dx / Math.abs(dy)) * rectHalfHeight;
    } else {
      edgeX = x + (dx > 0 ? rectHalfWidth : -rectHalfWidth);
      edgeY = y + (dy / Math.abs(dx)) * rectHalfWidth;
    }
    return [edgeX, edgeY];
  }

  static clampToRectangleEdges(
    edgeX,
    edgeY,
    rectHalfWidth,
    rectHalfHeight,
    x,
    y
  ) {
    edgeX = Math.max(x - rectHalfWidth, Math.min(x + rectHalfWidth, edgeX));
    edgeY = Math.max(y - rectHalfHeight, Math.min(y + rectHalfHeight, edgeY));
    return { x: edgeX, y: edgeY };
  }

  static getRectangleEdgeForChild(child, dx, dy, x, y) {
    const childSlopeX = Math.abs(dx / child.width);
    const childSlopeY = Math.abs(dy / child.height);
    let endX, endY;
    if (childSlopeX > childSlopeY) {
      endX = x - (dx > 0 ? child.width / 2 : -child.width / 2);
      endY = y - ((dy / Math.abs(dx)) * child.width) / 2;
    } else {
      endY = y - (dy > 0 ? child.height / 2 : -child.height / 2);
      endX = x - ((dx / Math.abs(dy)) * child.height) / 2;
    }
    return { x: endX, y: endY };
  }

  static calculateRectangleToCircleConnection(sourceRectangle, targetCircle) {
    if (!(sourceRectangle instanceof Rectangle)) return;
    if (!(targetCircle instanceof Circle)) return;
    const dx = targetCircle.x - sourceRectangle.x;
    const dy = targetCircle.y - sourceRectangle.y;
    const angle = Math.atan2(dy, dx);
    const rectEdge = RectangleMath.getRectangleEdge(
      dx,
      dy,
      sourceRectangle.actualWidth,
      sourceRectangle.height,
      sourceRectangle.x,
      sourceRectangle.y
    );
    const circleEdge = RectangleMath.getCircleEdge(targetCircle, angle);

    return {
      startX: rectEdge.x,
      startY: rectEdge.y,
      endX: circleEdge.x,
      endY: circleEdge.y,
    };
  }

  static calculateRectangleToRectangleConnection(
    sourceRectangle,
    targetRectangle
  ) {
    if (!(sourceRectangle instanceof Rectangle)) return;
    if (!(targetRectangle instanceof Rectangle)) return;
    const dx = targetRectangle.x - sourceRectangle.x;
    const dy = targetRectangle.y - sourceRectangle.y;
    const startEdge = RectangleMath.getRectangleEdge(
      dx,
      dy,
      sourceRectangle.actualWidth,
      sourceRectangle.height,
      sourceRectangle.x,
      sourceRectangle.y
    );
    const endEdge = RectangleMath.getRectangleEdgeForChild(
      targetRectangle,
      dx,
      dy,
      targetRectangle.x,
      targetRectangle.y
    );

    return {
      startX: startEdge.x,
      startY: startEdge.y,
      endX: endEdge.x,
      endY: endEdge.y,
    };
  }
}
