import MillisecondTimer from "./MillisecondTimer.js";
import ContextMenuHandler from "./ContextMenuHandler.js";

const DOUBLE_CLICK_THRESHOLD = 250;
const MOUSE_MODES = {
  NORMAL: "normal",
  COLOR: "color",
  RESIZE: "resize",
  RENAME: "rename",
  DELETE: "delete",
  COPY_COLOR: "copy_color",
};
const CURSOR_STYLES = {
  normal: "default",
  color: "crosshair",
  resize: "ew-resize",
  rename: "text",
  delete: "not-allowed",
  copy_color: "copy",
};

export default class MouseHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.nodeController = mindMap.nodeController;
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
      this.nodeController
    );
    this.mode = MOUSE_MODES.NORMAL;
    this.selectedColor = null;
    this.initMouseListeners();
    this.updateCanvasCursorStyle();
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
    document
      .getElementById("copy-color-button")
      .addEventListener("click", () => this.setMode(MOUSE_MODES.COPY_COLOR));
  }

  setMode(mode) {
    if (!Object.values(MOUSE_MODES).includes(mode)) {
      console.error(`Invalid mode: ${mode}`);
      return;
    }
    this.mode = mode;
    this.updateCanvasCursorStyle();
  }

  updateCanvasCursorStyle() {
    const canvas = this.mindMap.canvas;
    canvas.style.cursor = CURSOR_STYLES[this.mode] || "default";
  }

  handleCanvasMouseDown(event) {
    this.mouseDown = true;
    const { x, y } = this.getMouseCoordinates(event);
    const draggedCircle = this.nodeController.getNodeAtPosition(x, y);
    if (!draggedCircle) return;
    this.draggingCircle = draggedCircle;
    this.dragOffsetX = draggedCircle.x - x;
    this.dragOffsetY = draggedCircle.y - y;
    if (this.nodeController.selectedNode !== draggedCircle) {
      this.nodeController.selectNode(draggedCircle);
    }
  }

  handleCanvasMouseMove(event) {
    if (!this.mouseDown || !this.draggingCircle) return;
    const { x, y } = this.getMouseCoordinates(event);
    this.nodeController.moveNode(
      this.draggingCircle,
      x + this.dragOffsetX,
      y + this.dragOffsetY
    );
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
    const clickedCircle = this.nodeController.getNodeAtPosition(x, y);
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
    if (clickedCircle && this.mode == MOUSE_MODES.NORMAL) {
      this.nodeController.addConnectedRectangle(clickedCircle, x, y);
    }
  }

  handleSingleClick(clickedCircle, x, y, currentTime) {
    this.lastLeftClickTime = currentTime;
    this.lastLeftClickX = x;
    this.lastLeftClickY = y;
    if (
      this.nodeController.selectedNode &&
      this.nodeController.selectedNode !== clickedCircle
    ) {
      this.nodeController.unselectNode();
    }
    if (clickedCircle) {
      this.nodeController.selectNode(clickedCircle);
      this.onCircleSelection(clickedCircle);
    } else {
      this.nodeController.unselectNode();
      this.setMode(MOUSE_MODES.NORMAL);
    }
  }

  handleCanvasRightClick(event) {
    event.preventDefault();
    if (event.button !== 2) return;
    const { x, y } = this.getMouseCoordinates(event);
    const rightClickedCircle = this.nodeController.getNodeAtPosition(x, y);
    if (rightClickedCircle) {
      this.contextMenuHandler.showContextMenu(rightClickedCircle, x, y);
    }
    this.setMode(MOUSE_MODES.NORMAL);
  }

  handleCanvasMouseLeave(event) {
    this.mouseDown = false;
    this.draggingCircle = null;
  }

  handleCanvasMouseWheel(event) {
    if (!this.nodeController.selectedNode) return;
    event.preventDefault();
    this.nodeController.updateSelectedNodeDimensions(event.deltaY > 0 ? -5 : 5);
  }

  onCircleSelection(circle) {
    switch (this.mode) {
      case MOUSE_MODES.COLOR:
        const selectedColor = this.contextMenuHandler.colorPicker.value;
        this.nodeController.setSelectedNodeColor(selectedColor);
        break;
      case MOUSE_MODES.RESIZE:
        const newRadiusStr = document.getElementById(
          "circle-radius-input"
        ).value;
        const newRadius = parseFloat(newRadiusStr);
        this.nodeController.setSelectedCircleRadius(newRadius);
        break;
      case MOUSE_MODES.RENAME:
        this.nodeController.renameSelectedNodePrompt();
        break;
      case MOUSE_MODES.DELETE:
        this.nodeController.removeNode(circle);
        break;
      case MOUSE_MODES.COPY_COLOR:
        this.selectedColor = this.nodeController.getNodeColor(circle);
        this.contextMenuHandler.colorPicker.value = this.selectedColor;
        this.setMode(MOUSE_MODES.COLOR);
        break;
      case MOUSE_MODES.NORMAL:
      default:
        console.log("Circle selected:", circle);
        break;
    }
  }
}
