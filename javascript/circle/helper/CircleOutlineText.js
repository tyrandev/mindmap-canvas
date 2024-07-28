export default class CircleOutlineText {
  static generateTextOutline(circle) {
    if (!(circle instanceof Circle)) {
      throw new Error("Invalid argument: Expected an instance of Circle.");
    }

    const generateOutline = (circle, depth = 0) => {
      let result = `${"  ".repeat(depth)}- ${circle.text}\n`;
      circle.children.forEach((child) => {
        result += generateOutline(child, depth + 1);
      });
      return result;
    };

    return generateOutline(circle);
  }
}

// TODO: test this class
