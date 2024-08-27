import NodeSerializer from "../../util/serializer/NodeSerializer.js";

export default class JsonImporter {
  constructor(nodeController) {
    this.nodeController = nodeController;
  }

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target.result;
          this._loadFromJson(json);
          resolve({ json, filename: file.name });
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  importFromJsonString(jsonString) {
    try {
      this._loadFromJson(jsonString);
    } catch (error) {
      throw new Error("Invalid JSON string");
    }
  }

  _loadFromJson(json) {
    const rootNode = NodeSerializer.deserialize(json);
    this.nodeController.loadMindMap(rootNode);
  }
}
