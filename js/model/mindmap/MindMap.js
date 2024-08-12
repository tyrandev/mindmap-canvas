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

  setCanvasSize(canvas, width, height) {
    const ratio = window.devicePixelRatio || 1;
    const style = canvas.style;

    style.width = `${width}px`;
    style.height = `${height}px`;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // Optional: scale the context to match the device pixel ratio
    this.context.scale(ratio, ratio);
  }

  initializeCanvas() {
    this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);
    this.context = this.canvas.getContext("2d");
    this.setCanvasSize(this.canvas, 2600, 1800);
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
