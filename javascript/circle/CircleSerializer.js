import Circle from "./Circle.js";

export default class CircleSerializer {
  // Convert a Circle object to JSON
  static serialize(circle) {
    if (!(circle instanceof Circle)) {
      throw new Error("Invalid argument: Expected an instance of Circle.");
    }

    // Recursively serialize the circle and its children
    const serializeCircle = (circle) => {
      return {
        id: circle.id,
        x: circle.x,
        y: circle.y,
        radius: circle.radius,
        text: circle.text,
        fillColor: circle.fillColor,
        borderColor: circle.borderColor,
        textColor: circle.textColor,
        borderWidth: circle.borderWidth,
        collapsed: circle.collapsed,
        children: circle.children.map(serializeCircle),
      };
    };

    return JSON.stringify(serializeCircle(circle), null, 2);
  }

  // Convert JSON to a Circle object
  static deserialize(json) {
    const parseCircle = (data) => {
      const circle = new Circle(
        data.x,
        data.y,
        data.radius,
        data.text,
        data.fillColor,
        data.borderColor,
        data.textColor,
        data.borderWidth
      );
      circle.id = data.id; // Ensure the id is also set correctly
      circle.collapsed = data.collapsed;

      // Recursively create child circles
      data.children.forEach((childData) => {
        const childCircle = parseCircle(childData);
        circle.addChildNode(childCircle);
      });

      return circle;
    };

    const data = JSON.parse(json);
    return parseCircle(data);
  }
}
