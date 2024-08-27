import * as GlobalConstants from "../../../constants/GlobalConstants.js";

export default class MediaConverter {
  static containerSelector = "#canvas-container";
  static defaultFileName = "mindmap";

  static getContainer() {
    const container = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );
    if (!container) {
      console.error(
        `Container with id "${GlobalConstants.CANVAS_CONTAINER_ID}" not found.`
      );
    }
    return container;
  }

  static async captureContainer() {
    const container = this.getContainer();
    if (!container) return null;
    const scale = window.devicePixelRatio || 1;
    const originalBoxShadow = this.removeBoxShadow(container);
    try {
      const canvas = await html2canvas(container, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
      });
      this.restoreBoxShadow(container, originalBoxShadow);
      return canvas;
    } catch (error) {
      this.restoreBoxShadow(container, originalBoxShadow);
      console.error("Error capturing the container:", error);
      return null;
    }
  }

  static removeBoxShadow(container) {
    const originalBoxShadow = container.style.boxShadow;
    container.style.boxShadow = "none";
    return originalBoxShadow;
  }

  static restoreBoxShadow(container, originalBoxShadow) {
    container.style.boxShadow = originalBoxShadow;
  }

  static sanitizeFileName(fileName, defaultFileName) {
    return fileName
      ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
      : defaultFileName;
  }

  static promptFileName(extension, defaultFileName) {
    const fileName = prompt(
      `Enter the file name (without .${extension} extension):`,
      defaultFileName
    );
    if (fileName === null) return null;
    return this.sanitizeFileName(fileName, defaultFileName);
  }
}
