import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";
import NodeFactory from "../factory/NodeFactory.js";

export default class NodeSerializer {
  static serialize(node) {
    if (!(node instanceof Circle || node instanceof Rectangle)) {
      throw new Error(
        "Invalid argument: Expected an instance of Circle or Rectangle."
      );
    }

    const serializeNode = (node) => {
      const baseData = {
        id: node.id,
        x: node.x,
        y: node.y,
        text: node.text,
        fillColor: node.fillColor,
        borderColor: node.borderColor,
        textColor: node.textColor,
        borderWidth: node.borderWidth,
        collapsed: node.collapsed,
        children: node.children.map(serializeNode),
      };

      if (node instanceof Circle) {
        return {
          ...baseData,
          radius: node.radius,
        };
      } else if (node instanceof Rectangle) {
        return {
          ...baseData,
          width: node.width,
          height: node.height,
          cornerRadii: node.cornerRadii,
        };
      }
    };

    return JSON.stringify(serializeNode(node), null, 2);
  }

  static deserialize(json) {
    const parseNode = (data) => {
      let node;

      if (data.radius !== undefined) {
        node = NodeFactory.createCircleFromJson(data);
      } else if (data.width !== undefined) {
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
