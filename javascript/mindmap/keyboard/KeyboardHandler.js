import CircleSerializer from "../../circle/helper/CircleSerializer.js";

export default class KeyboardHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.circleController = mindMap.circleController;
    this.fileHandler = mindMap.fileHandler;
    this.fileInput = mindMap.fileInput;
    this.initKeyListeners();
  }

  initKeyListeners() {
    this.mindMap.canvas.addEventListener(
      "keydown",
      this.handleKeyDown.bind(this)
    );
    this.mindMap.canvas.setAttribute("tabindex", "0"); // Ensure canvas can receive focus
  }

  handleKeyDown(event) {
    console.log("Key pressed:", event.key);

    if (event.key === "z" && event.ctrlKey) {
      event.preventDefault();
      this.circleController.undo();
    }

    if (event.key === "y" && event.ctrlKey) {
      event.preventDefault();
      this.circleController.redo();
    }

    if (event.key === "F3" && this.circleController.selectedCircle) {
      event.preventDefault();
      this.circleController.toggleSelectedCircleCollapse();
    }

    if (event.key === "F2" && this.circleController.selectedCircle) {
      console.log("F2 pressed and circle selected");
      event.preventDefault();
      const newName = prompt("Enter new name for the circle:");
      if (newName !== null) {
        this.circleController.renameSelectedCircle(newName);
      }
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      this.fileHandler.saveToJson();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "o") {
      event.preventDefault();
      this.fileInput.click();
    }

    if (
      (event.key === "Backspace" || event.key === "Delete") &&
      this.circleController.selectedCircle
    ) {
      console.log("Backspace/Delete pressed and circle selected");
      event.preventDefault();
      this.circleController.removeCircle(this.circleController.selectedCircle);
    }

    if (event.key === "Tab" && this.circleController.selectedCircle) {
      console.log("Tab pressed and circle selected");
      event.preventDefault();
      this.circleController.randomizeSelectedCircleColor();
    }

    if (event.key === "Escape" && this.circleController.selectedCircle) {
      console.log("Escape pressed and circle selected");
      event.preventDefault();
      this.circleController.unselectCircle();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "l") {
      event.preventDefault();
      const filename = prompt("Enter the name to save the mind map:");
      if (filename) {
        const rootCircle = this.circleController.getMotherCircle();
        const json = CircleSerializer.serialize(rootCircle);
        this.fileHandler.saveToLocalStorage(filename, json);
      }
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "m") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      this.fileHandler.createLocalStorageList();
      alert("Saved mind maps:\n" + savedMindMaps.join("\n"));
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "p") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      const selectedMap = prompt(
        "Enter the name of the mind map to load:",
        savedMindMaps.join(", ")
      );
      if (selectedMap) {
        this.fileHandler.loadFromLocalStorage(selectedMap);
      }
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "d") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      const mapToDelete = prompt(
        "Enter the name of the mind map to delete:",
        savedMindMaps.join(", ")
      );
      if (mapToDelete) {
        this.fileHandler.deleteFromLocalStorage(mapToDelete);
        alert(`Mind map '${mapToDelete}' has been deleted.`);
      }
    }
  }
}
