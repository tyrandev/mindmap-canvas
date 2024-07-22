const canvasContainer = document.querySelector(".canvas-container");
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let scrollLeftStart = 0;
let scrollTopStart = 0;
let grabbingMode = false;

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", function (event) {
    if (event.key === "Shift") {
      grabbingMode = true;
      canvasContainer.style.cursor = "grab";
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "Shift") {
      grabbingMode = false;
      canvasContainer.style.cursor = "auto";
    }
  });

  canvasContainer.addEventListener("mousedown", function (event) {
    if (event.button === 0 && grabbingMode) {
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      scrollLeftStart = canvasContainer.scrollLeft;
      scrollTopStart = canvasContainer.scrollTop;
      canvasContainer.style.cursor = "grabbing";
    }
  });

  canvasContainer.addEventListener("mousemove", function (event) {
    if (isDragging) {
      const deltaX = dragStartX - event.clientX;
      const deltaY = dragStartY - event.clientY;
      canvasContainer.scrollLeft = scrollLeftStart + deltaX;
      canvasContainer.scrollTop = scrollTopStart + deltaY;
    }
  });

  canvasContainer.addEventListener("mouseup", function (event) {
    if (event.button === 0) {
      // Left mouse button
      isDragging = false;
      if (grabbingMode) {
        canvasContainer.style.cursor = "grab";
      } else {
        canvasContainer.style.cursor = "auto";
      }
    }
  });

  canvasContainer.addEventListener("selectstart", function (event) {
    event.preventDefault();
  });

  canvasContainer.addEventListener("contextmenu", function (event) {
    if (isDragging) {
      event.preventDefault();
    }
  });

  canvasContainer.addEventListener("mouseleave", function (event) {
    isDragging = false;
    if (grabbingMode) {
      canvasContainer.style.cursor = "grab";
    } else {
      canvasContainer.style.cursor = "auto";
    }
  });
});
