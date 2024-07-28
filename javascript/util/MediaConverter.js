export default class MediaConverter {
  static containerSelector = "#canvas-container";
  static defaultFileName = "mindmap";

  static getContainer() {
    const container = document.querySelector(this.containerSelector);
    if (!container) {
      console.error(
        `Container with selector "${this.containerSelector}" not found.`
      );
    }
    return container;
  }

  static async captureContainer() {
    const container = this.getContainer();
    if (!container) return null;

    const scale = window.devicePixelRatio || 1;
    const originalBoxShadow = container.style.boxShadow;
    container.style.boxShadow = "none";

    try {
      const canvas = await html2canvas(container, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
      });
      container.style.boxShadow = originalBoxShadow;
      return canvas;
    } catch (error) {
      container.style.boxShadow = originalBoxShadow;
      console.error("Error capturing the container:", error);
      return null;
    }
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
