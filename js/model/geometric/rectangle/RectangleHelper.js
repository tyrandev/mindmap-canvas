export default class RectangleHelper {
  static roundRect(context, x, y, width, height, radii) {
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

    context.moveTo(x + topLeftRadius, y);
    context.arcTo(x + width, y, x + width, y + height, topRightRadius);
    context.arcTo(x + width, y + height, x, y + height, bottomRightRadius);
    context.arcTo(x, y + height, x, y, bottomLeftRadius);
    context.arcTo(x, y, x + width, y, topLeftRadius);
    context.closePath();
  }
}
