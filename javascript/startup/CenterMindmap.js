const canvasContainer = document.querySelector(".canvas-container");

document.addEventListener("DOMContentLoaded", function () {
  scrollToCenter();
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
