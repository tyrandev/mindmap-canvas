import NodeController from "../../controller/NodeController.js";
import LocalStorageFileHandler from "../localstorage/LocalStorageFileHandler.js";
import KeyboardHandler from "../../gui/keyboard/KeyboardHandler.js";
import MouseHandler from "../../gui/mouse/MouseHandler.js";
import TopMenuHandler from "../../gui/topmenu/TopMenuHandler.js";
import ScrollUtil from "../../util/canvas/ScrollUtil.js";
import DraggingModeUtil from "../../util/canvas/DraggingModeUtil.js";
import Canvas from "./Canvas.js";

export default class MindMap {
  initializeCanvas() {
    Canvas.initializeCanvas();
    Canvas.setCanvasSize(4000, 2160);
  }

  initializeControllers() {
    this.nodeController = new NodeController();
    this.fileHandler = new LocalStorageFileHandler(this.nodeController);
  }

  initializeHandlers() {
    this.keyboardHandler = new KeyboardHandler(this);
    this.topMenuHandler = new TopMenuHandler(this);
    this.mouseHandler = new MouseHandler(this);
  }

  initializeUtilities() {
    ScrollUtil.scrollToCenter();
    DraggingModeUtil.init();
  }

  startApplication() {
    this.initializeCanvas();
    this.initializeControllers();
    this.initializeHandlers();
    this.initializeUtilities();
  }
}
