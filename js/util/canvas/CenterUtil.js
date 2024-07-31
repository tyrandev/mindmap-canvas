import * as GlobalConstants from "../../constants/GlobalConstants.js";

export default class CenterUtil {
  static calculateCenterX(elementId = GlobalConstants.MINDMAP_CANVAS_ID) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found.`);
    }
    const rect = element.getBoundingClientRect();
    return rect.width / 2;
  }

  static calculateCenterY(elementId = GlobalConstants.MINDMAP_CANVAS_ID) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found.`);
    }
    const rect = element.getBoundingClientRect();
    return rect.height / 2;
  }
}
