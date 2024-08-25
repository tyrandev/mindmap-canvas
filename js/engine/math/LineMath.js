export default class LineMath {
  static calculateControlPointsForCurvedLine(startX, startY, endX, endY) {
    const controlX1 = startX + (endX - startX) / 2;
    const controlY1 = startY;
    const controlX2 = startX + (endX - startX) / 2;
    const controlY2 = endY;
    return { controlX1, controlY1, controlX2, controlY2 };
  }
}
