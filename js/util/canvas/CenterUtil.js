import Canvas from "../../model/mindmap/Canvas.js";

export default class CenterUtil {
  static calculateCenterX() {
    const canvas = Canvas.getCanvas();
    if (!canvas) {
      throw new Error(`Canvas element not found.`);
    }
    return canvas.width / 2;
  }

  static calculateCenterY() {
    const canvas = Canvas.getCanvas();
    if (!canvas) {
      throw new Error(`Canvas element not found.`);
    }
    return canvas.height / 2;
  }
}
