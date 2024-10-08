import MouseModeManager from "./state/MouseModeManager.js";
import NodeContextMenu from "../../gui/contextmenu/NodeContextMenu.js";
import CanvasMenuHandler from "../../gui/contextmenu/CanvasContextMenu.js";
import Canvas from "../../view/Canvas.js";
import MousePosition from "./MousePosition.js";
import ColorPicker from "../../gui/topmenu/ColorPicker.js";
import * as MouseConstants from "../../constants/MouseConstants.js";
import DoubleClickTimer from "./DoubleClickTimer.js";

export default class MouseHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.canvas = Canvas.getCanvas();
    this.nodeController = systemCore.nodeController;
    this.selectionController = this.nodeController.selectionController;
    this.mouseDown = false;
    this.draggingNode = null;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.doubleClickTimer = new DoubleClickTimer();
    this.NodeContextMenu = new NodeContextMenu(systemCore);
    this.canvasMenuHandler = new CanvasMenuHandler(systemCore);
    this.modeManager = MouseModeManager;
    this.colorPicker = ColorPicker.getColorPicker();
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
    if (this.selectionController.selectedNode !== draggedNode) {
      this.selectionController.selectNode(draggedNode);
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
    const isDoubleClick = this.doubleClickTimer.checkDoubleClick(x, y);
    const clickedNode = this.nodeController.getNodeAtPosition(x, y);

    if (isDoubleClick) {
      this.handleDoubleClick(clickedNode, x, y);
      this.doubleClickTimer.reset();
      return;
    }
    this.handleSingleClick(clickedNode, x, y);
  }

  handleDoubleClick(clickedNode, x, y) {
    if (
      clickedNode &&
      this.modeManager.getMode() === MouseConstants.MOUSE_MODES.NORMAL
    ) {
      this.nodeController.addConnectedRectangle(clickedNode, x, y);
    }
  }

  handleSingleClick(clickedNode, x, y) {
    console.log("left clicked on position: x: ", x, " y: ", y);
    if (
      this.selectionController.selectedNode &&
      this.selectionController.selectedNode !== clickedNode
    ) {
      this.selectionController.unselectNode();
    }
    if (clickedNode) {
      this.selectionController.selectNode(clickedNode);
      this.onNodeSelection(clickedNode);
    } else {
      this.selectionController.unselectNode();
      this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleCanvasRightClick(event) {
    event.preventDefault();
    if (event.button !== 2) return;
    const { x, y } = this.getMouseCoordinates();
    const rightClickedNode = this.nodeController.getNodeAtPosition(x, y);
    if (rightClickedNode) {
      this.showNodeContextMenu(rightClickedNode, x, y);
    } else {
      this.showCanvasContextMenu(x, y);
      this.canvasMenuHandler.showContextMenu(x, y);
    }
    this.modeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
  }

  showCanvasContextMenu(x, y) {
    this.selectionController.unselectNode();
    this.canvasMenuHandler.showContextMenu(x, y);
    this.NodeContextMenu.hideContextMenu();
  }

  showNodeContextMenu(node, x, y) {
    this.NodeContextMenu.showContextMenu(node, x, y);
    this.canvasMenuHandler.hideContextMenu();
  }

  handleCanvasMouseLeave(event) {
    this.mouseDown = false;
    this.draggingNode = null;
  }

  handleCanvasMouseWheel(event) {
    if (!this.selectionController.selectedNode) return;
    event.preventDefault();
    this.selectionController.updateSelectedNodeDimensions(
      event.deltaY > 0 ? -5 : 5
    );
  }

  onNodeSelection(node) {
    switch (this.modeManager.getMode()) {
      case MouseConstants.MOUSE_MODES.CHANGE_COLOR:
        const selectedColor = this.colorPicker.getColor();
        this.selectionController.setSelectedNodeColor(selectedColor);
        break;
      case MouseConstants.MOUSE_MODES.RESIZE:
        const newRadiusStr = document.getElementById(
          "circle-radius-input"
        ).value;
        const newRadius = parseFloat(newRadiusStr);
        this.selectionController.setSelectedCircleRadius(newRadius);
        break;
      case MouseConstants.MOUSE_MODES.RENAME:
        this.selectionController.renameSelectedNodePrompt();
        break;
      case MouseConstants.MOUSE_MODES.DELETE:
        this.nodeController.removeNode(node);
        break;
      case MouseConstants.MOUSE_MODES.COPY_COLOR:
        this.colorPicker.setColor(node.getFillColor());
        this.modeManager.setMode(MouseConstants.MOUSE_MODES.CHANGE_COLOR);
        break;
      case MouseConstants.MOUSE_MODES.NORMAL:
      default:
        console.log("Node selected:", node);
        break;
    }
  }

  getMouseCoordinates() {
    return MousePosition.getMouseCoordinates();
  }
}
