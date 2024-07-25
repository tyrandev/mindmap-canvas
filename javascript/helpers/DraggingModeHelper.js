export default class DraggingModeHelper {
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static scrollLeftStart = 0;
  static scrollTopStart = 0;
  static grabbingMode = false;

  static init() {
    document.addEventListener(
      "DOMContentLoaded",
      DraggingModeHelper.setupEventListeners
    );
  }

  static setupEventListeners() {
    const canvasContainer = document.querySelector("#canvas-container");

    document.addEventListener("keydown", DraggingModeHelper.handleKeyDown);
    document.addEventListener("keyup", DraggingModeHelper.handleKeyUp);

    canvasContainer.addEventListener(
      "mousedown",
      DraggingModeHelper.handleMouseDown
    );
    canvasContainer.addEventListener(
      "mousemove",
      DraggingModeHelper.handleMouseMove
    );
    canvasContainer.addEventListener(
      "mouseup",
      DraggingModeHelper.handleMouseUp
    );
    canvasContainer.addEventListener(
      "selectstart",
      DraggingModeHelper.handleSelectStart
    );
    canvasContainer.addEventListener(
      "contextmenu",
      DraggingModeHelper.handleContextMenu
    );
    canvasContainer.addEventListener(
      "mouseleave",
      DraggingModeHelper.handleMouseLeave
    );
  }

  static handleKeyDown(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.key === "Shift") {
      DraggingModeHelper.grabbingMode = true;
      canvasContainer.style.cursor = "grab";
      console.log("dragging is on");
    }
  }

  static handleKeyUp(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.key === "Shift") {
      DraggingModeHelper.grabbingMode = false;
      canvasContainer.style.cursor = "auto";
    }
  }

  static handleMouseDown(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.button === 0 && DraggingModeHelper.grabbingMode) {
      DraggingModeHelper.isDragging = true;
      DraggingModeHelper.dragStartX = event.clientX;
      DraggingModeHelper.dragStartY = event.clientY;
      DraggingModeHelper.scrollLeftStart = canvasContainer.scrollLeft;
      DraggingModeHelper.scrollTopStart = canvasContainer.scrollTop;
      canvasContainer.style.cursor = "grabbing";
    }
  }

  static handleMouseMove(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (DraggingModeHelper.isDragging) {
      const deltaX = DraggingModeHelper.dragStartX - event.clientX;
      const deltaY = DraggingModeHelper.dragStartY - event.clientY;
      canvasContainer.scrollLeft = DraggingModeHelper.scrollLeftStart + deltaX;
      canvasContainer.scrollTop = DraggingModeHelper.scrollTopStart + deltaY;
    }
  }

  static handleMouseUp(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    if (event.button === 0) {
      // Left mouse button
      DraggingModeHelper.isDragging = false;
      if (DraggingModeHelper.grabbingMode) {
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
    if (DraggingModeHelper.isDragging) {
      event.preventDefault();
    }
  }

  static handleMouseLeave(event) {
    const canvasContainer = document.querySelector("#canvas-container");
    DraggingModeHelper.isDragging = false;
    if (DraggingModeHelper.grabbingMode) {
      canvasContainer.style.cursor = "grab";
    } else {
      canvasContainer.style.cursor = "auto";
    }
  }
}

// // Initialize the DraggingModeHelper class when the DOM is loaded
// DraggingModeHelper.init();
