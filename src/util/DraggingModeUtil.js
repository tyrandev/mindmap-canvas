export default class DraggingModeUtil {
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static scrollLeftStart = 0;
  static scrollTopStart = 0;
  static grabbingMode = false;

  static init() {
    document.addEventListener(
      "DOMContentLoaded",
      DraggingModeUtil.setupEventListeners
    );
  }

  static setupEventListeners() {
    const canvasContainer = document.querySelector("#canvas-container");

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
      "contextmenu",
      DraggingModeUtil.handleContextMenu
    );
    canvasContainer.addEventListener(
      "mouseleave",
      DraggingModeUtil.handleMouseLeave
    );
  }

  static handleKeyDown(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.key === "Shift") {
      DraggingModeUtil.grabbingMode = true;
      canvasContainer.style.cursor = "grab";
      console.log("dragging is on");
    }
  }

  static handleKeyUp(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.key === "Shift") {
      DraggingModeUtil.grabbingMode = false;
      canvasContainer.style.cursor = "auto";
    }
  }

  static handleMouseDown(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.button === 0 && DraggingModeUtil.grabbingMode) {
      DraggingModeUtil.isDragging = true;
      DraggingModeUtil.dragStartX = event.clientX;
      DraggingModeUtil.dragStartY = event.clientY;
      DraggingModeUtil.scrollLeftStart = canvasContainer.scrollLeft;
      DraggingModeUtil.scrollTopStart = canvasContainer.scrollTop;
      canvasContainer.style.cursor = "grabbing";
    }
  }

  static handleMouseMove(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (DraggingModeUtil.isDragging) {
      const deltaX = DraggingModeUtil.dragStartX - event.clientX;
      const deltaY = DraggingModeUtil.dragStartY - event.clientY;
      canvasContainer.scrollLeft = DraggingModeUtil.scrollLeftStart + deltaX;
      canvasContainer.scrollTop = DraggingModeUtil.scrollTopStart + deltaY;
    }
  }

  static handleMouseUp(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.button === 0) {
      // Left mouse button
      DraggingModeUtil.isDragging = false;
      if (DraggingModeUtil.grabbingMode) {
        canvasContainer.style.cursor = "grab";
      } else {
        canvasContainer.style.cursor = "auto";
      }
    }
  }

  static handleSelectStart(event) {
    event.preventDefault();
  }

  static handleContextMenu(event) {
    if (DraggingModeUtil.isDragging) {
      event.preventDefault();
    }
  }

  static handleMouseLeave(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    DraggingModeUtil.isDragging = false;
    if (DraggingModeUtil.grabbingMode) {
      canvasContainer.style.cursor = "grab";
    } else {
      canvasContainer.style.cursor = "auto";
    }
  }
}
