import CircleSerializer from "../../circle/helper/CircleSerializer.js";
import LocalStorageUIHandler from "./LocalStorageUIHandler.js";

export default class LocalStorageFileHandler {
  constructor(circleController) {
    this.circleController = circleController;
    this.uiHandler = new LocalStorageUIHandler(this);
    this.currentJsonFile = null;
  }

  exportToJson(filename) {
    // Get the root circle and serialize it
    const rootCircle = this.circleController.getMotherCircle();
    const json = CircleSerializer.serialize(rootCircle);

    // Create a blob from the JSON string
    const blob = new Blob([json], { type: "application/json" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Ensure the filename ends with .json
    if (!filename.endsWith(".json")) {
      filename += ".json";
    }

    // Create a temporary anchor element for the download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    // Append the anchor to the document, click it to start the download, and remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      const rootCircle = CircleSerializer.deserialize(json);
      this.circleController.resetAllCircles();
      this.circleController.addCircleAndChildren(rootCircle);
      this.circleController.drawCircles();
      this.currentJsonFile = file.name;
    };
    reader.readAsText(file);
  }

  saveToLocalStorage() {
    // Suggest the name of the current JSON file if it's not null
    const suggestedName = this.currentJsonFile || "";
    let name = prompt("Enter the filename for the JSON file:", suggestedName);

    if (name) {
      // Get the root circle and serialize it
      const rootCircle = this.circleController.getMotherCircle();
      const json = CircleSerializer.serialize(rootCircle);

      const mindmaps = this.getSavedMindMaps();
      mindmaps[name] = json;
      localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
      this.uiHandler.createLocalStorageList();
      this.currentJsonFile = name; // Update the currentJsonFile
    }
  }

  loadFromLocalStorage(name) {
    const mindmaps = this.getSavedMindMaps();
    const json = mindmaps[name];
    if (!json) {
      alert(`No mindmap found with the name "${name}".`);
      return;
    }

    const rootCircle = CircleSerializer.deserialize(json);
    this.circleController.resetAllCircles();
    this.circleController.addCircleAndChildren(rootCircle);
    this.circleController.drawCircles();
    this.currentJsonFile = name;
    console.log(`Current json file name: ${this.currentJsonFile}`);
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
      this.currentJsonFile = null;
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
