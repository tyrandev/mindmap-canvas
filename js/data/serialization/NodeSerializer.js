import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import BorderlessRectangle from "../../model/geometric/rectangle/BorderlessRectangle.js";
import NodeFactory from "../../services/factory/NodeFactory.js";

export default class NodeSerializer {
  static serialize(node) {
    if (
      !(
        node instanceof Circle ||
        node instanceof Rectangle ||
        node instanceof BorderlessRectangle
      )
    ) {
      throw new Error(
        "Invalid argument: Expected an instance of Circle, Rectangle, or BorderlessRectangle."
      );
    }
    return JSON.stringify(node.toJSON(), null, 2);
  }

  static deserialize(json) {
    const parseNode = (data) => {
      let node;
      if (data.type === "Circle") {
        node = NodeFactory.createCircleFromJson(data);
      } else if (data.type === "BorderlessRectangle") {
        node = NodeFactory.createBorderlessRectangleFromJson(data);
      } else if (data.type === "Rectangle") {
        node = NodeFactory.createRectangleFromJson(data);
      } else {
        throw new Error("Unknown node type in JSON data.");
      }
      node.id = data.id;
      node.collapsed = data.collapsed;
      data.children.forEach((childData) => {
        const childNode = parseNode(childData);
        node.addChildNode(childNode);
      });
      return node;
    };

    const data = JSON.parse(json);
    return parseNode(data);
  }
}
