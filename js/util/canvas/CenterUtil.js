export default class CenterUtil {
  static calculateCenterX(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found.`);
    }

    const rect = element.getBoundingClientRect();
    return rect.width / 2;
  }

  static calculateCenterY(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found.`);
    }

    const rect = element.getBoundingClientRect();
    return rect.height / 2;
  }
}
