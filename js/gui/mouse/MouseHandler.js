import MouseModeManager from "./MouseModeManager.js";
import MillisecondTimer from "../../util/time/MillisecondTimer.js";
import ContextMenuHandler from "../contextmenu/ContextMenuHandler.js";
import Canvas from "../../model/mindmap/Canvas.js";
import MousePosition from "./MousePosition.js";
import ColorPicker from "../topmenu/ColorPicker.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

export default class MouseHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.canvas = Canvas.getCanvas();
    this.nodeController = mindMap.nodeController;
    this.mouseDown = false;
    this.draggingNode = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.doubleClickTimer = new MillisecondTimer();
    this.lastLeftClickTime = 0;
    this.lastLeftClickX = 0;
    this.lastLeftClickY = 0;
    this.contextMenuHandler = new ContextMenuHandler(mindMap);
    this.modeManager = MouseModeManager;
    this.selectedColor = null;
    this.colorPicker = ColorPicker.getColorPicker();
    this.mousePosition = MousePosition.getInstance();
    this.initMouseListeners();
  }

  initMouseListeners() {
    const canvas = this.canvas;
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
  }

  handleCanvasMouseDown() {
    this.mouseDown = true;
    const { x, y } = this.getMouseCoordinates();
    const draggedNode = this.nodeController.getNodeAtPosition(x, y);
    if (!draggedNode) return;
    this.draggingNode = draggedNode;
    this.dragOffsetX = draggedNode.x - x;
    this.dragOffsetY = draggedNode.y - y;
    if (this.nodeController.selectedNode !== draggedNode) {
      this.nodeController.selectNode(draggedNode);
    }
  }

  handleCanvasMouseMove() {
    if (!this.mouseDown || !this.draggingNode) return;
    const { x, y } = this.getMouseCoordinates();
    this.nodeController.moveNode(
      this.draggingNode,
      x + this.dragOffsetX,
      y + this.dragOffsetY
    );
  }

  handleCanvasMouseUp(event) {
    this.mouseDown = false;
    this.draggingNode = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
  }

  handleCanvasLeftClick(event) {
    if (event.button !== 0) return;
    const { x, y } = this.getMouseCoordinates();
    const currentTime = performance.now();
    const timeSinceLastClick = currentTime - this.lastLeftClickTime;
    const clickedNode = this.nodeController.getNodeAtPosition(x, y);
    const isDoubleClick =
      timeSinceLastClick <= MouseConstants.DOUBLE_CLICK_THRESHOLD &&
      Math.abs(x - this.lastLeftClickX) <= 10 &&
      Math.abs(y - this.lastLeftClickY) <= 10 &&
      clickedNode !== null;
    if (isDoubleClick) {
      this.handleDoubleClick(clickedNode, x, y);
      this.lastLeftClickTime = 0;
      return;
    }
    this.handleSingleClick(clickedNode, x, y, currentTime);
  }

  handleDoubleClick(clickedNode, x, y) {
    this.doubleClickTimer.start();
    if (
      clickedNode &&
      this.modeManager.getMode() === MouseConstants.MOUSE_MODES.NORMAL
    ) {
      this.nodeController.addConnectedCircle(clickedNode, x, y);
    }
  }

  handleSingleClick(clickedNode, x, y, currentTime) {
    this.lastLeftClickTime = currentTime;
    this.lastLeftClickX = x;
    this.lastLeftClickY = y;
    console.log("left clicked on position: x:", x, " y: ", y);
    if (
      this.nodeController.selectedNode &&
      this.nodeController.selectedNode !== clickedNode
    ) {
      this.nodeController.unselectNode();
    }
    if (clickedNode) {
      this.nodeController.selectNode(clickedNode);
      this.onNodeSelection(clickedNode);
    } else {
      this.nodeController.unselectNode();
      this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleCanvasRightClick(event) {
    event.preventDefault();
    if (event.button !== 2) return;
    const { x, y } = this.getMouseCoordinates();
    const rightClickedNode = this.nodeController.getNodeAtPosition(x, y);
    if (rightClickedNode) {
      this.contextMenuHandler.showContextMenu(rightClickedNode, x, y);
    } else {
      this.nodeController.unselectNode();
    }
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
  }

  handleCanvasMouseLeave(event) {
    this.mouseDown = false;
    this.draggingNode = null;
  }

  handleCanvasMouseWheel(event) {
    if (!this.nodeController.selectedNode) return;
    event.preventDefault();
    this.nodeController.updateSelectedNodeDimensions(event.deltaY > 0 ? -5 : 5);
  }

  onNodeSelection(node) {
    switch (this.modeManager.getMode()) {
      case MouseConstants.MOUSE_MODES.CHANGE_COLOR:
        const selectedColor = this.colorPicker.getColor();
        this.nodeController.setSelectedNodeColor(selectedColor);
        break;
      case MouseConstants.MOUSE_MODES.RESIZE:
        const newRadiusStr = document.getElementById(
          "circle-radius-input"
        ).value;
        const newRadius = parseFloat(newRadiusStr);
        this.nodeController.setSelectedCircleRadius(newRadius);
        break;
      case MouseConstants.MOUSE_MODES.RENAME:
        this.nodeController.renameSelectedNodePrompt();
        break;
      case MouseConstants.MOUSE_MODES.DELETE:
        this.nodeController.removeNode(node);
        break;
      case MouseConstants.MOUSE_MODES.COPY_COLOR:
        this.selectedColor = node.getFillColor();
        this.contextMenuHandler.colorPicker.value = this.selectedColor;
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.CHANGE_COLOR);
        break;
      case MouseConstants.MOUSE_MODES.NORMAL:
      default:
        console.log("Node selected:", node);
        break;
    }
  }

  getMouseCoordinates() {
    return this.mousePosition.getMouseCoordinates();
  }
}
