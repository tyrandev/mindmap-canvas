export default class ContextMenuHandler {
  constructor(mindMap, circleController) {
    this.mindMap = mindMap;
    this.circleController = circleController;
    this.contextMenu = document.getElementById("context-menu");
    this.contextMenuCircle = null;

    this.initContextMenu();
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  initContextMenu() {
    document
      .getElementById("add-node")
      .addEventListener("click", this.addNode.bind(this));
    document
      .getElementById("rename-node")
      .addEventListener("click", this.renameNode.bind(this));
    document
      .getElementById("delete-node")
      .addEventListener("click", this.deleteNode.bind(this));
    document
      .getElementById("resize-node")
      .addEventListener("click", this.resizeNode.bind(this));
    document
      .getElementById("color-node")
      .addEventListener("click", this.colorNode.bind(this));
  }

  showContextMenu(circle, x, y) {
    const rect = this.mindMap.canvas.getBoundingClientRect();
    const adjustedX = rect.left + x;
    const adjustedY = rect.top + y;

    this.contextMenu.style.display = "block";
    this.contextMenu.style.left = `${adjustedX}px`;
    this.contextMenu.style.top = `${adjustedY}px`;

    this.contextMenuCircle = circle;
  }

  hideContextMenu() {
    this.contextMenu.style.display = "none";
  }

  handleDocumentClick(event) {
    if (event.button !== 2) {
      this.hideContextMenu();
    }
  }

  addNode() {
    if (this.contextMenuCircle) {
      const { x, y } = this.contextMenuCircle;
      this.circleController.addConnectedCircle(
        this.contextMenuCircle,
        x + 50,
        y + 50
      );
      this.hideContextMenu();
    }
  }

  renameNode() {
    if (this.contextMenuCircle) {
      const newName = prompt(
        "Enter new name for the node:",
        this.contextMenuCircle.name
      );
      if (newName) {
        this.circleController.renameSelectedCircle(newName);
      }
      this.hideContextMenu();
    }
  }

  deleteNode() {
    if (this.contextMenuCircle) {
      this.circleController.removeCircle(this.contextMenuCircle);
      this.hideContextMenu();
    }
  }

  resizeNode() {
    console.log("Resize node method called.");
  }

  colorNode() {
    console.log("Color node method called.");
  }
}
