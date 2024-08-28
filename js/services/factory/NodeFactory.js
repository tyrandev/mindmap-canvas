import Circle from "../../model/geometric/circle/Circle.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";

export default class NodeFactory {
  static idCounter = 0;

  static incrementId() {
    return NodeFactory.idCounter++;
  }

  static createCircle(x, y) {
    const circle = new Circle(x, y);
    circle.setId(NodeFactory.incrementId());
    return circle;
  }

  static createRectangle(x, y) {
    const rectangle = new Rectangle(x, y);
    rectangle.setId(NodeFactory.incrementId());
    return rectangle;
  }

  static createBorderlessRectangle(x, y) {
    const borderlessRectangle = new BorderlessRectangle(x, y);
    borderlessRectangle.setId(NodeFactory.incrementId);
    return borderlessRectangle;
  }

  static createCircleFromJson(data) {
    const circle = new Circle(data.x, data.y);
    circle.radius = data.radius;
    circle.text = data.text;
    circle.fillColor = data.fillColor;
    circle.borderColor = data.borderColor;
    circle.textColor = data.textColor;
    circle.borderWidth = data.borderWidth;
    circle.setId(data.id);
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
    rectangle.setId(data.id);
    return rectangle;
  }
}
