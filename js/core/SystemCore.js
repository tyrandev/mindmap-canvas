import NodeController from "../controller/NodeController.js";
import SelectionManager from "../controller/SelectionManager.js";
import LocalStorageFileHandler from "../model/localstorage/LocalStorageFileHandler.js";
import KeyboardHandler from "../gui/keyboard/KeyboardHandler.js";
import MouseHandler from "../gui/mouse/MouseHandler.js";
import TopMenuHandler from "../gui/topmenu/TopMenuHandler.js";
import ScrollUtil from "../util/canvas/ScrollUtil.js";
import DraggingModeUtil from "../util/canvas/DraggingModeUtil.js";
import Canvas from "../util/canvas/Canvas.js";

export default class SystemCore {
  initializeCanvas() {
    Canvas.setCanvasSize(4000, 2160);
  }

  initializeControllers() {
    this.nodeController = new NodeController();
    this.selectionManager = new SelectionManager();
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
