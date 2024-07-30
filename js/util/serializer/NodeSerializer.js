import Circle from "../../model/geometric/circle/Circle.js";
import Rectangle from "../../model/geometric/rectangle/Rectangle.js";

export default class NodeSerializer {
  // Convert a Node object (Circle or Rectangle) to JSON
  static serialize(node) {
    if (!(node instanceof Circle || node instanceof Rectangle)) {
      throw new Error(
        "Invalid argument: Expected an instance of Circle or Rectangle."
      );
    }

    // Recursively serialize the node and its children
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
          roundedCorners: node.roundedCorners,
        };
      }
    };

    return JSON.stringify(serializeNode(node), null, 2);
  }

  // Convert JSON to a Node object (Circle or Rectangle)
  static deserialize(json) {
    const parseNode = (data) => {
      let node;

      if (data.radius !== undefined) {
        // Deserialize as Circle
        node = new Circle(
          data.x,
          data.y,
          data.radius,
          data.text,
          data.fillColor,
          data.borderColor,
          data.textColor,
          data.borderWidth
        );
      } else if (data.width !== undefined) {
        // Deserialize as Rectangle
        node = new Rectangle(
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
      } else {
        throw new Error("Unknown node type in JSON data.");
      }

      node.id = data.id;
      node.collapsed = data.collapsed;

      // Recursively create child nodes
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
