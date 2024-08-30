import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";

export default class NodeFactory {
  static idCounter = 0;

  static incrementId() {
    return NodeFactory.idCounter++;
  }

  static createCircle(x, y) {
    return NodeFactory._initializeNode(new Circle(x, y));
  }

  static createRectangle(x, y) {
    return NodeFactory._initializeNode(new Rectangle(x, y));
  }

  static createBorderlessRectangle(x, y) {
    return NodeFactory._initializeNode(new BorderlessRectangle(x, y));
  }

  static createCircleFromJson(data) {
    return NodeFactory._initializeNodeFromJson(
      new Circle(data.x, data.y),
      data
    );
  }

  static createRectangleFromJson(data) {
    return NodeFactory._initializeNodeFromJson(
      new Rectangle(data.x, data.y),
      data
    );
  }

  static createBorderlessRectangleFromJson(data) {
    return NodeFactory._initializeNodeFromJson(
      new BorderlessRectangle(data.x, data.y),
      data
    );
  }

  static _initializeNode(node) {
    node.setId(NodeFactory.incrementId());
    return node;
  }

  static _initializeNodeFromJson(node, data) {
    node.id = data.id;
    node.x = data.x;
    node.y = data.y;
    node.text = data.text;
    node.fillColor = data.fillColor;
    node.borderColor = data.borderColor;
    node.lineColor = data.lineColor;
    node.textColor = data.textColor;
    node.borderWidth = data.borderWidth;

    if (node instanceof Circle) {
      node.radius = data.radius;
    } else if (
      node instanceof Rectangle ||
      node instanceof BorderlessRectangle
    ) {
      node.width = data.width;
      node.height = data.height;
      node.cornerRadii = data.cornerRadii;
    }

    return node;
  }
}
