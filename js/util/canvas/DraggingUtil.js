import * as GlobalConstants from "../../constants/GlobalConstants.js";
import MouseModeManager from "../../input/mouse/state/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

export default class DraggingUtil {
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static scrollLeftStart = 0;
  static scrollTopStart = 0;

  static init() {
    document.addEventListener(
      "DOMContentLoaded",
      DraggingUtil.setupEventListeners
    );
  }

  static setupEventListeners() {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );

    canvasContainer.addEventListener("mousedown", DraggingUtil.handleMouseDown);
    canvasContainer.addEventListener("mousemove", DraggingUtil.handleMouseMove);
    canvasContainer.addEventListener("mouseup", DraggingUtil.handleMouseUp);
    canvasContainer.addEventListener(
      "selectstart",
      DraggingUtil.handleSelectStart
    );
    canvasContainer.addEventListener(
      "mouseleave",
      DraggingUtil.handleMouseLeave
    );
  }

  static handleMouseDown(event) {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );
    if (
      event.button === 0 &&
      MouseModeManager.getMode() === MouseConstants.MOUSE_MODES.GRABBING_MINDMAP
    ) {
      DraggingUtil.isDragging = true;
      DraggingUtil.dragStartX = event.clientX;
      DraggingUtil.dragStartY = event.clientY;
      DraggingUtil.scrollLeftStart = canvasContainer.scrollLeft;
      DraggingUtil.scrollTopStart = canvasContainer.scrollTop;
    }
  }

  static handleMouseMove(event) {
    const canvasContainer = document.getElementById(
      GlobalConstants.CANVAS_CONTAINER_ID
    );
    if (DraggingUtil.isDragging) {
      const deltaX = DraggingUtil.dragStartX - event.clientX;
      const deltaY = DraggingUtil.dragStartY - event.clientY;
      canvasContainer.scrollLeft = DraggingUtil.scrollLeftStart + deltaX;
      canvasContainer.scrollTop = DraggingUtil.scrollTopStart + deltaY;
    }
  }

  static handleMouseUp(event) {
    if (event.button === 0) {
      DraggingUtil.isDragging = false;
    }
  }

  static handleSelectStart(event) {
    event.preventDefault();
  }

  static handleMouseLeave(event) {
    DraggingUtil.isDragging = false;
  }
}
