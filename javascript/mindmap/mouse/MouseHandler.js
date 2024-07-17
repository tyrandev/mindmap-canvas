import MillisecondTimer from "./MillisecondTimer.js";
import ContextMenuHandler from "./ContextMenuHandler.js";

const DOUBLE_CLICK_THRESHOLD = 250;

const MOUSE_MODES = {
  NORMAL: "normal",
  COLOR: "color",
  RESIZE: "resize",
  RENAME: "rename",
  DELETE: "delete",
};

const CURSOR_STYLES = {
  normal: "default",
  color: "crosshair",
  resize: "ew-resize",
  rename: "text",
  delete: "not-allowed",
};

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
    this.contextMenuHandler = new ContextMenuHandler(
      mindMap,
      this.circleController
    );
    this.mode = MOUSE_MODES.NORMAL; // Add mode property
    this.initMouseListeners();
    this.updateCanvasCursor();
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

    // Example of setting mode through UI elements
    document
      .getElementById("color-button")
      .addEventListener("click", () => this.setMode(MOUSE_MODES.COLOR));
    document
      .getElementById("resize-button")
      .addEventListener("click", () => this.setMode(MOUSE_MODES.RESIZE));
    document
      .getElementById("rename-button")
      .addEventListener("click", () => this.setMode(MOUSE_MODES.RENAME));
    document
      .getElementById("delete-node-button")
      .addEventListener("click", () => this.setMode(MOUSE_MODES.DELETE));
    document
      .getElementById("normal-cursor-mode")
      .addEventListener("click", () => this.setMode(MOUSE_MODES.NORMAL));
  }

  setMode(mode) {
    if (Object.values(MOUSE_MODES).includes(mode)) {
      this.mode = mode;
      this.updateCanvasCursor(); // Update cursor style when mode changes
    } else {
      console.error(`Invalid mode: ${mode}`);
    }
  }

  updateCanvasCursor() {
    const canvas = this.mindMap.canvas;
    canvas.style.cursor = CURSOR_STYLES[this.mode] || "default";
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
      this.circleController.addConnectedCircle(clickedCircle, x, y);
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
      this.circleController.selectCircle(clickedCircle);
      this.onCircleSelection(clickedCircle);
    } else {
      this.circleController.unselectCircle();
      this.setMode(MOUSE_MODES.NORMAL);
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
      this.contextMenuHandler.showContextMenu(rightClickedCircle, x, y);
    }
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
    this.circleController.updateCircleRadius(event.deltaY > 0 ? -5 : 5);
  }

  onCircleSelection(circle) {
    switch (this.mode) {
      case MOUSE_MODES.COLOR:
        // Read the selected color from the color picker
        const selectedColor = this.contextMenuHandler.colorPicker.value;
        // Change the color of the circle using the method
        this.circleController.setSelectedCircleColor(selectedColor);
        break;
      case MOUSE_MODES.RESIZE:
        const newRadiusStr = document.getElementById(
          "circle-radius-input"
        ).value;
        const newRadius = parseFloat(newRadiusStr);
        if (!isNaN(newRadius) && newRadius > 0) {
          this.circleController.setSelectedCircleRadius(newRadius);
        }
        break;
      case MOUSE_MODES.RENAME:
        const newName = prompt("Enter new name for the node:", circle.text);
        if (newName) {
          this.circleController.renameSelectedCircle(newName);
        }
        break;
      case MOUSE_MODES.DELETE:
        if (confirm("Are you sure you want to delete this node?")) {
          this.circleController.removeCircle(circle);
        }
        break;
      case MOUSE_MODES.NORMAL:
      default:
        console.log("Circle selected:", circle);
        break;
    }
  }
}
