export default class ScrollHelper {
  static scrollToCenter() {
    const canvasContainer = document.querySelector("#canvas-container");
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
      canvasContainer;
    const centerX = ScrollHelper.calculateCenterX(scrollWidth, clientWidth);
    const centerY = ScrollHelper.calculateCenterY(scrollHeight, clientHeight);
    ScrollHelper.scrollToPosition(canvasContainer, centerX, centerY);
  }

  static calculateCenterX(scrollWidth, clientWidth) {
    return (scrollWidth - clientWidth) / 2;
  }

  static calculateCenterY(scrollHeight, clientHeight) {
    return (scrollHeight - clientHeight) / 2;
  }

  static scrollToPosition(canvasContainer, centerX, centerY) {
    canvasContainer.scrollLeft = centerX;
    canvasContainer.scrollTop = centerY;
  }
}
