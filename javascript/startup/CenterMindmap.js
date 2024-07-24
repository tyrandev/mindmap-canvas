function scrollToCenter() {
  const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
    canvasContainer;

  const centerX = calculateCenterX(scrollWidth, clientWidth);
  const centerY = calculateCenterY(scrollHeight, clientHeight);

  scrollToPosition(centerX, centerY);
}

function calculateCenterX(scrollWidth, clientWidth) {
  return (scrollWidth - clientWidth) / 2;
}

function calculateCenterY(scrollHeight, clientHeight) {
  return (scrollHeight - clientHeight) / 2;
}

function scrollToPosition(centerX, centerY) {
  canvasContainer.scrollLeft = centerX;
  canvasContainer.scrollTop = centerY;
}
