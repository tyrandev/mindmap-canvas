import Node from "../circle/Node.js";

export default class NodeOutlineText {
  static generateTextOutline(node) {
    if (!(node instanceof Node)) {
      throw new Error("Invalid argument: Expected an instance of Node.");
    }
    const generateOutline = (node, depth = 0) => {
      let result = `${"  ".repeat(depth)}- ${node.text}\n`;
      node.children.forEach((child) => {
        result += generateOutline(child, depth + 1);
      });
      return result;
    };
    return generateOutline(node);
  }

  static downloadTextOutline(node) {
    const fileName = prompt(
      "Enter the file name (without .txt extension):",
      "mindmap"
    );
    if (fileName === null) {
      return;
    }
    const sanitizedFileName = this.sanitizeFileName(fileName, "mindmap");
    const textOutline = this.generateTextOutline(node);
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
