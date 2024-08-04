export default class KeyboardHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.nodeController = mindMap.nodeController;
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
      this.nodeController.undo();
    }

    if (key === "y" && event.ctrlKey) {
      event.preventDefault();
      this.nodeController.redo();
    }

    if (key === "f3" && this.nodeController.selectedNode) {
      event.preventDefault();
      this.nodeController.toggleSelectedNodeCollapse();
    }

    if (key === "f2" && this.nodeController.selectedNode) {
      event.preventDefault();
      this.nodeController.renameSelectedNodePrompt();
    }

    if ((event.ctrlKey || event.metaKey) && key === "e") {
      event.preventDefault();
      this.fileHandler.exportToJson();
    }

    if ((event.ctrlKey || event.metaKey) && key === "o") {
      event.preventDefault();
      // CenterMindmap.scrollToCenter();
    }

    if (
      (key === "backspace" || key === "delete") &&
      this.nodeController.selectedNode
    ) {
      console.log("Backspace/Delete pressed and node selected");
      event.preventDefault();
      this.nodeController.removeNode(this.nodeController.selectedNode);
    }

    if (key === "tab" && this.nodeController.selectedNode) {
      console.log("Tab pressed and node selected");
      event.preventDefault();
      this.nodeController.randomizeSelectedNodeColor();
    }

    if (key === "escape" && this.nodeController.selectedNode) {
      console.log("Escape pressed and node selected");
      event.preventDefault();
      this.nodeController.unselectNode();
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

    if ((event.ctrlKey || event.metaKey) && key === "c") {
      event.preventDefault();
      // this.nodeController.copySelectedNode();
    }

    if ((event.ctrlKey || event.metaKey) && key === "x") {
      event.preventDefault();
      // this.nodeController.cutSelectedNode();
    }

    if ((event.ctrlKey || event.metaKey) && key === "v") {
      event.preventDefault();
      // this.nodeController.pasteSelectedNode();
    }
  }
}
