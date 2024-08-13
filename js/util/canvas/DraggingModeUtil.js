import * as GlobalConstants from "../../constants/GlobalConstants.js";
import MouseModeManager from "../../gui/mouse/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

export default class DraggingModeUtil {
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static scrollLeftStart = 0;
  static scrollTopStart = 0;

  static init() {
    document.addEventListener(
      "DOMContentLoaded",
      DraggingModeUtil.setupEventListeners
    );
  }

  static setupEventListeners() {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );

    document.addEventListener("keydown", DraggingModeUtil.handleKeyDown);
    document.addEventListener("keyup", DraggingModeUtil.handleKeyUp);

    canvasContainer.addEventListener(
      "mousedown",
      DraggingModeUtil.handleMouseDown
    );
    canvasContainer.addEventListener(
      "mousemove",
      DraggingModeUtil.handleMouseMove
    );
    canvasContainer.addEventListener("mouseup", DraggingModeUtil.handleMouseUp);
    canvasContainer.addEventListener(
      "selectstart",
      DraggingModeUtil.handleSelectStart
    );
    canvasContainer.addEventListener(
      "mouseleave",
      DraggingModeUtil.handleMouseLeave
    );
  }

  static handleKeyDown(event) {
    if (event.key === "Shift") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.GRABBING_MINDMAP);
      console.log("Dragging is on");
    }
  }

  static handleKeyUp(event) {
    if (event.key === "Shift") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  static handleMouseDown(event) {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );
    if (
      event.button === 0 &&
      MouseModeManager.getMode() === MouseConstants.MOUSE_MODES.GRABBING_MINDMAP
    ) {
      DraggingModeUtil.isDragging = true;
      DraggingModeUtil.dragStartX = event.clientX;
      DraggingModeUtil.dragStartY = event.clientY;
      DraggingModeUtil.scrollLeftStart = canvasContainer.scrollLeft;
      DraggingModeUtil.scrollTopStart = canvasContainer.scrollTop;
    }
  }

  static handleMouseMove(event) {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );
    if (DraggingModeUtil.isDragging) {
      const deltaX = DraggingModeUtil.dragStartX - event.clientX;
      const deltaY = DraggingModeUtil.dragStartY - event.clientY;
      canvasContainer.scrollLeft = DraggingModeUtil.scrollLeftStart + deltaX;
      canvasContainer.scrollTop = DraggingModeUtil.scrollTopStart + deltaY;
    }
  }

  static handleMouseUp(event) {
    if (event.button === 0) {
      DraggingModeUtil.isDragging = false;
    }
  }

  static handleSelectStart(event) {
    event.preventDefault();
  }

  static handleMouseLeave(event) {
    DraggingModeUtil.isDragging = false;
  }
}
