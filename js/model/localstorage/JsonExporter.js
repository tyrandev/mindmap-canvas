export default class JsonExporter {
  constructor(nodeController) {
    this.nodeController = nodeController;
  }

  exportToJson() {
    const filename = this._getFilenameForExport();
    if (!filename) return;

    const json = this._getSerializedJson();
    this._downloadFile(filename, json);
  }

  _getFilenameForExport() {
    const suggestedName = this.currentJsonFile || "";
    return prompt("Enter the name to export the mind map:", suggestedName);
  }

  _getSerializedJson() {
    return this.nodeController.serializeRootNode();
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
