import MillisecondTimer from "./MillisecondTimer.js";

const DOUBLE_CLICK_THRESHOLD = 250;

export default class MouseHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.circleController = mindMap.circleController;
    this.mouseDown = false;
    this.draggingCircle = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.doubleClickTimer = new MillisecondTimer();
    this.lastLeftClickTime = 0;
    this.lastLeftClickX = 0;
    this.lastLeftClickY = 0;
    this.initMouseListeners();
    this.initContextMenu();
  }

  getMouseCoordinates(event) {
    const rect = this.mindMap.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  initMouseListeners() {
    const canvas = this.mindMap.canvas;
    canvas.addEventListener("mousedown", this.handleCanvasMouseDown.bind(this));
    canvas.addEventListener("mousemove", this.handleCanvasMouseMove.bind(this));
    canvas.addEventListener("mouseup", this.handleCanvasMouseUp.bind(this));
    canvas.addEventListener("click", this.handleCanvasLeftClick.bind(this));
    canvas.addEventListener(
      "contextmenu",
      this.handleCanvasRightClick.bind(this)
    );
    canvas.addEventListener(
      "mouseleave",
      this.handleCanvasMouseLeave.bind(this)
    );
    canvas.addEventListener("wheel", this.handleCanvasMouseWheel.bind(this));
    document.addEventListener("click", this.handleDocumentClick.bind(this));
  }

  initContextMenu() {
    this.contextMenu = document.getElementById("context-menu");
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

  handleCanvasMouseDown(event) {
    this.mouseDown = true;
    const { x, y } = this.getMouseCoordinates(event);
    const draggedCircle = this.circleController.getCircleAtPosition(x, y);

    if (!draggedCircle) {
      return;
    }

    this.draggingCircle = draggedCircle;
    this.dragOffsetX = draggedCircle.x - x;
    this.dragOffsetY = draggedCircle.y - y;

    // Update selected circle to the dragged circle
    if (this.circleController.selectedCircle !== draggedCircle) {
      this.circleController.selectCircle(draggedCircle);
    }
  }

  handleCanvasMouseMove(event) {
    if (this.mouseDown && this.draggingCircle) {
      const { x, y } = this.getMouseCoordinates(event);
      this.circleController.moveCircle(
        this.draggingCircle,
        x + this.dragOffsetX,
        y + this.dragOffsetY
      );
    }
  }

  handleCanvasMouseUp(event) {
    this.mouseDown = false;
    this.draggingCircle = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  handleCanvasLeftClick(event) {
    if (event.button !== 0) return;

    const { x, y } = this.getMouseCoordinates(event);
    const currentTime = performance.now();
    const timeSinceLastClick = currentTime - this.lastLeftClickTime;
    const clickedCircle = this.circleController.getCircleAtPosition(x, y);

    // Check if the click qualifies as a double click based on proximity
    const isDoubleClick =
      timeSinceLastClick <= DOUBLE_CLICK_THRESHOLD &&
      Math.abs(x - this.lastLeftClickX) <= 10 &&
      Math.abs(y - this.lastLeftClickY) <= 10 &&
      clickedCircle !== null;

    if (isDoubleClick) {
      this.handleDoubleClick(clickedCircle, x, y);
      this.lastLeftClickTime = 0;
      return;
    }

    this.handleSingleClick(clickedCircle, x, y, currentTime);
  }

  handleDoubleClick(clickedCircle, x, y) {
    this.doubleClickTimer.start();
    if (clickedCircle) {
      console.log("Double click detected on circle", clickedCircle);
      this.circleController.addConnectedCircle(clickedCircle, x, y);
    } else {
      console.log("Position double clicked with left button:", x, y);
    }
  }

  handleSingleClick(clickedCircle, x, y, currentTime) {
    this.lastLeftClickTime = currentTime;
    this.lastLeftClickX = x;
    this.lastLeftClickY = y;

    if (
      this.circleController.selectedCircle &&
      this.circleController.selectedCircle !== clickedCircle
    ) {
      this.circleController.unselectCircle();
    }

    if (clickedCircle) {
      console.log("Circle clicked with left button!", clickedCircle);
      this.circleController.selectCircle(clickedCircle);
    } else {
      console.log("Position clicked with left button:", x, y);
      this.circleController.unselectCircle();
    }
  }

  handleCanvasRightClick(event) {
    event.preventDefault();

    if (event.button !== 2) {
      return;
    }

    const { x, y } = this.getMouseCoordinates(event);
    const rightClickedCircle = this.circleController.getCircleAtPosition(x, y);

    if (rightClickedCircle) {
      this.showContextMenu(rightClickedCircle, x, y);
    }
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

  handleDocumentClick(event) {
    if (event.button !== 2) {
      hideContextMenu();
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
      hideContextMenu();
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
      hideContextMenu();
    }
  }

  deleteNode() {
    if (this.contextMenuCircle) {
      this.circleController.removeCircle(this.contextMenuCircle);
      hideContextMenu();
    }
  }

  resizeNode() {
    console.log("method resize node is called.");
  }

  colorNode() {
    console.log("method color node is called.");
  }

  hideContextMenu() {
    this.contextMenu.style.display = "none";
  }

  handleCanvasMouseLeave(event) {
    this.mouseDown = false;
    this.draggingCircle = null;
  }

  handleCanvasMouseWheel(event) {
    if (!this.circleController.selectedCircle) {
      return;
    }
    event.preventDefault();
    this.circleController.updateCircleRadius(
      this.circleController.selectedCircle,
      event.deltaY > 0 ? -5 : 5
    );
  }
}
