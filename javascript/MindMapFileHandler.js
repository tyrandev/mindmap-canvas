import CircleSerializer from "./circle/CircleSerializer.js";

export default class MindMapFileHandler {
  constructor(circleController) {
    this.circleController = circleController;
    this.createLocalStorageList();
  }

  saveToJson() {
    const rootCircle = this.circleController.getMotherCircle();
    const json = CircleSerializer.serialize(rootCircle);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Prompt user for the filename
    const filename = prompt(
      "Enter the filename for the JSON file:",
      "mindmap.json"
    );

    // Default to "mindmap.json" if the user cancels the prompt or inputs nothing
    const downloadFilename = filename ? filename : "mindmap.json";

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename; // Use the filename provided by the user or default to "mindmap.json"
    a.click();
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
    };
    reader.readAsText(file);
  }

  saveToLocalStorage(name, json) {
    const mindmaps = this.getSavedMindMaps();
    mindmaps[name] = json;
    localStorage.setItem("mindmaps", JSON.stringify(mindmaps));
    // alert(`Mindmap saved as "${name}" in local storage.`);
    this.createLocalStorageList();
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
    this.circleController.resetAllCircles();
    this.circleController.addCircleAndChildren(rootCircle);
    this.circleController.drawCircles();
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
    // alert(`Mindmap "${name}" deleted from local storage.`);
    this.createLocalStorageList();
  }

  listSavedMindMaps() {
    const mindmaps = this.getSavedMindMaps();
    return Object.keys(mindmaps);
  }

  createLocalStorageList() {
    const mindmapListDiv = this.getMindmapListDiv();
    if (!mindmapListDiv) return;

    this.clearMindmapListDiv(mindmapListDiv);

    const mindmaps = this.listSavedMindMaps();
    mindmaps.forEach((name) => {
      const itemDiv = this.createMindmapListItem(name);
      mindmapListDiv.appendChild(itemDiv);
    });
  }

  getMindmapListDiv() {
    const mindmapListDiv = document.getElementById("local-storage-list");
    if (!mindmapListDiv) {
      console.error('No div with id "local-storage-list" found.');
    }
    return mindmapListDiv;
  }

  clearMindmapListDiv(mindmapListDiv) {
    mindmapListDiv.innerHTML = "";
  }

  createMindmapListItem(name) {
    const div = document.createElement("div");
    div.classList.add("local-storage-item");
    div.textContent = name;

    this.addLoadEventListener(div, name);

    const deleteButton = this.createDeleteButton(name);
    div.appendChild(deleteButton);

    return div;
  }

  addLoadEventListener(element, name) {
    element.addEventListener("click", () => {
      this.loadFromLocalStorage(name);
    });
  }

  createDeleteButton(name) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Delete";

    this.addDeleteEventListener(deleteButton, name);

    return deleteButton;
  }

  addDeleteEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent triggering the load action
      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        this.deleteFromLocalStorage(name);
      }
    });
  }
}
