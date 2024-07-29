import CircleSerializer from "../../util/serializer/CircleSerializer.js";
import LocalStorageUIHandler from "../../gui/storage/LocalStorageUIHandler.js";

export default class LocalStorageFileHandler {
  constructor(nodeController) {
    this.nodeController = nodeController;
    this.uiHandler = new LocalStorageUIHandler(this);
    this.currentJsonFile = null; // Track the current localStorage file being modified
  }

  exportToJson() {
    const suggestedName = this.currentJsonFile || "";
    let filename = prompt(
      "Enter the name to export the mind map:",
      suggestedName
    );
    if (!filename) return;
    this.nodeController.unselectNode();
    const rootCircle = this.nodeController.getRootNode();
    const json = CircleSerializer.serialize(rootCircle);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Revoke the object URL to free up memory
  }

  saveToLocalStorage() {
    const suggestedName = this.currentJsonFile || "";
    let name = prompt("Enter the filename for the JSON file:", suggestedName);
    if (!name) return;
    this.nodeController.unselectNode();
    const rootCircle = this.nodeController.getRootNode();
    const json = CircleSerializer.serialize(rootCircle);
    const mindmaps = this.getSavedMindMaps();
    mindmaps[name] = json;
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    this.uiHandler.createLocalStorageList();
    this.currentJsonFile = name;
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      const rootCircle = CircleSerializer.deserialize(json);
      this.nodeController.resetAllNodes();
      this.nodeController.addNodeAndChildren(rootCircle);
      this.nodeController.drawNodes();
      this.nodeController.clearAllStacks();
      this.currentJsonFile = file.name;
    };
    reader.readAsText(file);
  }

  loadFromLocalStorage(name) {
    const mindmaps = this.getSavedMindMaps();
    const json = mindmaps[name];
    if (!json) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    const rootCircle = CircleSerializer.deserialize(json);
    this.nodeController.resetAllNodes();
    this.nodeController.addNodeAndChildren(rootCircle);
    this.nodeController.drawNodes();
    this.nodeController.clearAllStacks();
    this.currentJsonFile = name; // Update the currentJsonFile
  }

  getSavedMindMaps() {
    const mindmaps = localStorage.getItem("mindmaps");
    return mindmaps ? JSON.parse(mindmaps) : {};
  }

  deleteFromLocalStorage(name) {
    const mindmaps = this.getSavedMindMaps();
    if (!mindmaps[name]) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }
    delete mindmaps[name];
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === name) {
      this.currentJsonFile = null; // Clear currentJsonFile if it was deleted
    }
  }

  renameInLocalStorage(oldName, newName) {
    const mindmaps = this.getSavedMindMaps();
    if (!mindmaps[oldName]) {
      alert(`No mindmap found with the name "${oldName}".`);
      return;
    }
    if (mindmaps[newName]) {
      alert(`A mindmap with the name "${newName}" already exists.`);
      return;
    }
    mindmaps[newName] = mindmaps[oldName];
    delete mindmaps[oldName];
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    this.uiHandler.createLocalStorageList();
    if (this.currentJsonFile === oldName) {
      this.currentJsonFile = newName;
    }
  }

  listSavedMindMaps() {
    const mindmaps = this.getSavedMindMaps();
    return Object.keys(mindmaps);
  }
}
