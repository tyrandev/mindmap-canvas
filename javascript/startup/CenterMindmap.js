const canvasContainer = document.querySelector("#canvas-container");

const CanvasScroller = {
  scrollToCenter() {
    const { scrollWidth, scrollHeight, clientWidth, clientHeight } =
      canvasContainer;

    const centerX = this.calculateCenterX(scrollWidth, clientWidth);
    const centerY = this.calculateCenterY(scrollHeight, clientHeight);

    this.setScrollPosition(centerX, centerY);
  },

  calculateCenterX(scrollWidth, clientWidth) {
    return (scrollWidth - clientWidth) / 2;
  },

  calculateCenterY(scrollHeight, clientHeight) {
    return (scrollHeight - clientHeight) / 2;
  },

  setScrollPosition(centerX, centerY) {
    canvasContainer.scrollLeft = centerX;
    canvasContainer.scrollTop = centerY;
  },
};

document.addEventListener("DOMContentLoaded", function () {
  CanvasScroller.scrollToCenter();
});

export default CanvasScroller;
