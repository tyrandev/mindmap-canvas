import Circle from "../circle/Circle.js";

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

  static downloadTextOutline(circle) {
    const fileName = prompt(
      "Enter the file name (without .txt extension):",
      "mindmap"
    );

    // Abort if the user cancels the prompt
    if (fileName === null) {
      return;
    }

    const sanitizedFileName = this.sanitizeFileName(fileName, "mindmap");
    const textOutline = this.generateTextOutline(circle);
    const blob = new Blob([textOutline], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizedFileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static sanitizeFileName(fileName, defaultFileName) {
    return fileName
      ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
      : defaultFileName;
  }
}
