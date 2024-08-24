import * as MouseConstants from "../../constants/MouseConstants.js";

export default class DoubleClickTimer {
  constructor() {
    this.reset();
  }

  reset() {
    this.lastClickTime = 0;
    this.lastClickPosX = 0;
    this.lastClickPosY = 0;
  }

  checkDoubleClick(x, y) {
    const threshold = MouseConstants.DOUBLE_CLICK_THRESHOLD;
    const currentTime = performance.now();
    const timeSinceLastClick = currentTime - this.lastClickTime;
    const isDoubleClick =
      timeSinceLastClick <= threshold &&
      Math.abs(x - this.lastClickPosX) <= 10 &&
      Math.abs(y - this.lastClickPosY) <= 10;
    this.lastClickTime = currentTime;
    this.lastClickPosX = x;
    this.lastClickPosY = y;

    return isDoubleClick;
  }
}
