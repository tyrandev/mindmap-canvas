import Node from "../../model/geometric/node/Node.js";
import NodeFactory from "../../services/factory/NodeFactory.js";

export default class NodeSerializer {
  static serialize(node) {
    if (!(node instanceof Node)) {
      throw new Error("Invalid argument: Expected an instance of Node.");
    }
    return JSON.stringify(node.toJSON(), null, 2);
  }

  static deserialize(json) {
    const parseNode = (data) => {
      let node;
      switch (data.type) {
        case "Rectangle":
          node = NodeFactory.createRectangleFromJson(data);
          break;
        case "BorderlessRectangle":
          node = NodeFactory.createBorderlessRectangleFromJson(data);
          break;
        case "Circle":
          node = NodeFactory.createCircleFromJson(data);
          break;
        default:
          throw new Error(`Unknown node type in JSON data: ${data.type}`);
      }

      node.id = data.id || node.id;
      node.collapsed = data.collapsed || false;

      if (Array.isArray(data.children)) {
        data.children.forEach((childData) => {
          const childNode = parseNode(childData);
          node.addChildNode(childNode);
        });
      }

      return node;
    };

    const data = JSON.parse(json);
    return parseNode(data);
  }
}
