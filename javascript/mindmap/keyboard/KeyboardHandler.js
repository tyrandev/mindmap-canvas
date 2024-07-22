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
    const key = event.key.toLowerCase();
    console.log("Key pressed:", event.key);

    if (key === "z" && event.ctrlKey) {
      event.preventDefault();
      this.circleController.undo();
    }

    if (key === "y" && event.ctrlKey) {
      event.preventDefault();
      this.circleController.redo();
    }

    if (key === "f3" && this.circleController.selectedCircle) {
      event.preventDefault();
      this.circleController.toggleSelectedCircleCollapse();
    }

    if (key === "f2" && this.circleController.selectedCircle) {
      event.preventDefault();
      this.circleController.renameSelectedCirclePrompt();
    }

    if ((event.ctrlKey || event.metaKey) && key === "e") {
      event.preventDefault();
      this.fileHandler.exportToJson();
    }

    if ((event.ctrlKey || event.metaKey) && key === "o") {
      event.preventDefault();
      this.fileInput.click();
    }

    if (
      (key === "backspace" || key === "delete") &&
      this.circleController.selectedCircle
    ) {
      console.log("Backspace/Delete pressed and circle selected");
      event.preventDefault();
      this.circleController.removeCircle(this.circleController.selectedCircle);
    }

    if (key === "tab" && this.circleController.selectedCircle) {
      console.log("Tab pressed and circle selected");
      event.preventDefault();
      this.circleController.randomizeSelectedCircleColor();
    }

    if (key === "escape" && this.circleController.selectedCircle) {
      console.log("Escape pressed and circle selected");
      event.preventDefault();
      this.circleController.unselectCircle();
    }

    if ((event.ctrlKey || event.metaKey) && key === "s") {
      event.preventDefault();
      this.fileHandler.saveToLocalStorage();
    }

    if ((event.ctrlKey || event.metaKey) && key === "m") {
      event.preventDefault();
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      this.fileHandler.createLocalStorageList();
      alert("Saved mind maps:\n" + savedMindMaps.join("\n"));
    }

    if ((event.ctrlKey || event.metaKey) && key === "p") {
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

    if ((event.ctrlKey || event.metaKey) && key === "d") {
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
