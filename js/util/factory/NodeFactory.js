import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import * as CircleConstants from "../../constants/CircleConstants.js";
import * as RectangleConstants from "../../constants/RectangleConstants.js";

export default class NodeFactory {
  static createCircle(
    x,
    y,
    fillColor = CircleConstants.BASE_NODE_COLOR,
    radius = CircleConstants.BASE_CIRCLE_RADIUS,
    text = CircleConstants.NODE_DEFAULT_NAME
  ) {
    return new Circle(x, y, radius, text, fillColor);
  }

  static createRectangle(
    x,
    y,
    fillColor = RectangleConstants.BASE_RECTANGLE_COLOR,
    width = RectangleConstants.BASE_RECTANGLE_WIDTH,
    height = RectangleConstants.BASE_RECTANGLE_HEIGHT,
    text = RectangleConstants.NODE_DEFAULT_NAME
  ) {
    return new Rectangle(x, y, width, height, text, fillColor);
  }

  static createCircleFromJson(data) {
    return new Circle(
      data.x,
      data.y,
      data.radius,
      data.text,
      data.fillColor,
      data.borderColor,
      data.textColor,
      data.borderWidth
    );
  }

  static createRectangleFromJson(data) {
    return new Rectangle(
      data.x,
      data.y,
      data.width,
      data.height,
      data.text,
      data.fillColor,
      data.borderColor,
      data.textColor,
      data.borderWidth,
      data.cornerRadii,
      data.roundedCorners
    );
  }
}
