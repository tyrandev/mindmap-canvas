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
}
