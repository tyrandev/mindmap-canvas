export default class RectangleMath {
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
