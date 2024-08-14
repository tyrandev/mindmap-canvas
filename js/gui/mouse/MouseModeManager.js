import Canvas from "../../view/Canvas.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

class MouseModeManager {
  constructor() {
    if (MouseModeManager.instance) {
      return MouseModeManager.instance;
    }
    this.currentMode = MouseConstants.MOUSE_MODES.NORMAL;
    this.listeners = [];
    this.canvas = Canvas.getCanvas();
    MouseModeManager.instance = this;
  }

  static getInstance() {
    if (!MouseModeManager.instance) {
      MouseModeManager.instance = new MouseModeManager();
    }
    return MouseModeManager.instance;
  }

  getMode() {
    return this.currentMode;
  }

  setMode(mode) {
    if (!Object.values(MouseConstants.MOUSE_MODES).includes(mode)) {
      console.error(`Invalid mode: ${mode}`);
      return;
    }
    if (this.currentMode !== mode) {
      this.currentMode = mode;
      this.notifyListeners();
      this.updateCanvasCursorStyle();
    }
  }

  updateCanvasCursorStyle() {
    if (this.canvas) {
      const mode = this.getMode();
      this.canvas.style.cursor =
        MouseConstants.CURSOR_STYLES[mode] || "default";
    }
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => {
      if (typeof listener.onModeChange === "function") {
        listener.onModeChange(this.currentMode);
      }
    });
  }
}

export default MouseModeManager.getInstance();
