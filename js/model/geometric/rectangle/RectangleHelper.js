import RectangleMath from "./RectangleMath.js";

export default class RectangleHelper {
  static roundRect(context, x, y, width, height, radii) {
    const [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius] =
      RectangleMath.adjustRadii(width, height, radii);
    context.beginPath();
    context.moveTo(x + topLeftRadius, y);
    context.arcTo(x + width, y, x + width, y + height, topRightRadius);
    context.arcTo(x + width, y + height, x, y + height, bottomRightRadius);
    context.arcTo(x, y + height, x, y, bottomLeftRadius);
    context.arcTo(x, y, x + width, y, topLeftRadius);
    context.closePath();
  }
}
