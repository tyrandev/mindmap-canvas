import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";

export default class NodeFactory {
  static createCircle(x, y) {
    const circle = new Circle(x, y);
    return circle;
  }

  static createRectangle(x, y) {
    return new Rectangle(x, y);
  }

  static createCircleFromJson(data) {
    const circle = new Circle(data.x, data.y);
    circle.radius = data.radius;
    circle.text = data.text;
    circle.fillColor = data.fillColor;
    circle.borderColor = data.borderColor;
    circle.textColor = data.textColor;
    circle.borderWidth = data.borderWidth;
    return circle;
  }

  static createRectangleFromJson(data) {
    const rectangle = new Rectangle(data.x, data.y);
    rectangle.width = data.width;
    rectangle.height = data.height;
    rectangle.text = data.text;
    rectangle.fillColor = data.fillColor;
    rectangle.borderColor = data.borderColor;
    rectangle.textColor = data.textColor;
    rectangle.borderWidth = data.borderWidth;
    rectangle.cornerRadii = data.cornerRadii;
    return rectangle;
  }
}
