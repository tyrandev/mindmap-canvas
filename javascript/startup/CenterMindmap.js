const canvasContainer = document.querySelector(".canvas-container");

document.addEventListener("DOMContentLoaded", function () {
  scrollToCenter();
});

function scrollToCenter() {
  const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
    canvasContainer;

  const centerX = calculateCenterX(scrollWidth, clientWidth);
  const centerY = calculateCenterY(scrollHeight, clientHeight);

  setScrollPosition(centerX, centerY);
}

function calculateCenterX(scrollWidth, clientWidth) {
  return (scrollWidth - clientWidth) / 2;
}

function calculateCenterY(scrollHeight, clientHeight) {
  return (scrollHeight - clientHeight) / 2;
}

function setScrollPosition(centerX, centerY) {
  canvasContainer.scrollLeft = centerX;
  canvasContainer.scrollTop = centerY;
}
