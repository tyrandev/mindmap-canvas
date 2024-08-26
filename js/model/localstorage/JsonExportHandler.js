import MindmapSerializer from "./MindmapSerializer.js";

export default class JsonExportHandler {
  constructor(nodeController) {
    this.mindmapSerializer = new MindmapSerializer(nodeController);
  }

  exportToJson(currentJsonFile) {
    const filename = this._getFilenameForExport(currentJsonFile);
    if (!filename) return;

    const json = this.mindmapSerializer.serialize();
    this._downloadFile(filename, json);
  }

  _getFilenameForExport(currentJsonFile) {
    const suggestedName = currentJsonFile || "";
    return prompt("Enter the name to export the mind map:", suggestedName);
  }

  _downloadFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
