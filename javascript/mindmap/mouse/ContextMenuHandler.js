export default class ContextMenuHandler {
  constructor(mindMap, circleController) {
    this.mindMap = mindMap;
    this.circleController = circleController;
    this.contextMenu = document.getElementById("context-menu");
    this.contextMenuCircle = null;
    // Initialize the color picker element as a property of the class
    this.colorPicker = document.createElement("input");
    this.colorPicker.type = "color";
    this.colorPicker.id = "color-picker";
    this.colorPicker.addEventListener("input", this.applyColor.bind(this));
    // Append it to the element with id "color-button"
    document.getElementById("color-button").appendChild(this.colorPicker);
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
      .getElementById("collapse-node")
      .addEventListener("click", this.collapseNode.bind(this));
    document
      .getElementById("select-color-node")
      .addEventListener("click", this.selectColorNode.bind(this));
    document
      .getElementById("random-color-node")
      .addEventListener("click", this.randomColorNode.bind(this));
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
    if (!this.contextMenuCircle) return;
    const { x, y } = this.contextMenuCircle;
    this.circleController.addConnectedCircle(this.contextMenuCircle, x, y);
    this.hideContextMenu();
  }

  renameNode() {
    if (!this.contextMenuCircle) return;
    const newName = prompt(
      "Enter new name for the node:",
      this.contextMenuCircle.text
    );
    if (newName) {
      this.circleController.renameSelectedCircle(newName);
    }
    this.hideContextMenu();
  }

  collapseNode() {
    if (!this.contextMenuCircle) return;
    this.circleController.toggleSelectedCircleCollapse();
    this.hideContextMenu();
  }

  deleteNode() {
    if (!this.contextMenuCircle) return;
    this.circleController.removeCircle(this.contextMenuCircle);
    this.hideContextMenu();
  }

  resizeNode() {
    if (!this.contextMenuCircle) {
      console.error("No circle selected for resizing.");
      return;
    }
    const newRadiusStr = prompt(
      "Enter new radius for the node:",
      this.contextMenuCircle.radius
    );
    if (newRadiusStr === null) return;
    const newRadius = parseFloat(newRadiusStr);
    if (isNaN(newRadius) || newRadius <= 0) {
      alert("Invalid radius value. Please enter a number greater than 0.");
      return;
    }
    this.contextMenuCircle.setRadius(newRadius);
    this.circleController.drawCircles();
    this.hideContextMenu();
  }

  selectColorNode() {
    if (!this.contextMenuCircle) return;
    this.colorPicker.click(); // Show the color picker
  }

  applyColor(event) {
    if (!this.contextMenuCircle) return;
    const selectedColor = event.target.value;
    this.circleController.setSelectedCircleColor(selectedColor);
    this.hideContextMenu();
  }

  randomColorNode() {
    if (!this.contextMenuCircle) return;
    this.circleController.randomizeSelectedCircleColor();
    this.hideContextMenu();
  }
}
