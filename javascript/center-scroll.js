const canvasContainer = document.querySelector(".canvas-container");
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let scrollLeftStart = 0;
let scrollTopStart = 0;
let grabbingMode = false;

document.addEventListener("DOMContentLoaded", function () {
  scrollToCenter();

  // Enable grabbing mode when Control key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.key === "Control") {
      grabbingMode = true;
      canvasContainer.style.cursor = "grab"; // Change cursor style to indicate grabbing
    }
  });

  // Disable grabbing mode when Control key is released
  document.addEventListener("keyup", function (event) {
    if (event.key === "Control") {
      grabbingMode = false;
      canvasContainer.style.cursor = "auto"; // Revert cursor style to normal
    }
  });

  // Mouse down event listener
  canvasContainer.addEventListener("mousedown", function (event) {
    if (event.button === 0 && grabbingMode) {
      // Left mouse button and grabbing mode is active
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      scrollLeftStart = canvasContainer.scrollLeft;
      scrollTopStart = canvasContainer.scrollTop;
      canvasContainer.style.cursor = "grabbing"; // Change cursor style to indicate grabbing
    }
  });

  // Mouse move event listener
  canvasContainer.addEventListener("mousemove", function (event) {
    if (isDragging) {
      const deltaX = dragStartX - event.clientX;
      const deltaY = dragStartY - event.clientY;
      canvasContainer.scrollLeft = scrollLeftStart + deltaX;
      canvasContainer.scrollTop = scrollTopStart + deltaY;
    }
  });

  // Mouse up event listener
  canvasContainer.addEventListener("mouseup", function (event) {
    if (event.button === 0) {
      // Left mouse button
      isDragging = false;
      if (grabbingMode) {
        canvasContainer.style.cursor = "grab"; // Change cursor style to indicate grabbing
      } else {
        canvasContainer.style.cursor = "auto"; // Revert cursor style to normal
      }
    }
  });

  // Prevent text selection while dragging
  canvasContainer.addEventListener("selectstart", function (event) {
    event.preventDefault();
  });

  // Prevent context menu while dragging
  canvasContainer.addEventListener("contextmenu", function (event) {
    if (isDragging) {
      event.preventDefault();
    }
  });

  // Mouse leave event listener
  canvasContainer.addEventListener("mouseleave", function (event) {
    isDragging = false;
    if (grabbingMode) {
      canvasContainer.style.cursor = "grab"; // Change cursor style to indicate grabbing
    } else {
      canvasContainer.style.cursor = "auto"; // Revert cursor style to normal
    }
  });
});

function scrollToCenter() {
  // Calculate center positions
  const canvasWidth = canvasContainer.scrollWidth;
  const canvasHeight = canvasContainer.scrollHeight;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Scroll to center
  canvasContainer.scrollLeft = centerX - canvasContainer.clientWidth / 2;
  canvasContainer.scrollTop = centerY - canvasContainer.clientHeight / 2;
}
