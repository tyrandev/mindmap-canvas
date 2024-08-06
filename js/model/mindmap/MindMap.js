import NodeController from "../../controller/NodeController.js";
import LocalStorageFileHandler from "../localstorage/LocalStorageFileHandler.js";
import KeyboardHandler from "../../gui/keyboard/KeyboardHandler.js";
import MouseHandler from "../../gui/mouse/MouseHandler.js";
import TopMenuHandler from "../../gui/topmenu/TopMenuHandler.js";
import ScrollUtil from "../../util/canvas/ScrollUtil.js";
import DraggingModeUtil from "../../util/canvas/DraggingModeUtil.js";
import * as GlobalConstants from "../../constants/GlobalConstants.js";

export default class MindMap {
  constructor() {
    this.initializeCanvas();
    this.initializeControllers();
    this.initializeHandlers();
    this.initializeUtilities();
  }

  initializeCanvas() {
    this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);
    this.context = this.canvas.getContext("2d");
  }

  initializeControllers() {
    this.nodeController = new NodeController();
    this.fileHandler = new LocalStorageFileHandler(this.nodeController);
  }

  initializeHandlers() {
    this.keyboardHandler = new KeyboardHandler(this);
    this.mouseHandler = new MouseHandler(this);
    this.topMenuHandler = new TopMenuHandler(this);
  }

  initializeUtilities() {
    ScrollUtil.scrollToCenter();
    DraggingModeUtil.init();
  }
}
