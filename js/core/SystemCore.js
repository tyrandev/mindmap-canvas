import NodeController from "../controller/NodeController.js";
import SelectionController from "../controller/SelectionController.js";
import LocalStorageFileHandler from "../model/localstorage/LocalStorageFileHandler.js";
import KeyboardHandler from "../input/keyboard/KeyboardHandler.js";
import MouseHandler from "../input/mouse/MouseHandler.js";
import TopMenuHandler from "../gui/topmenu/TopMenuHandler.js";
import ScrollUtil from "../util/canvas/ScrollUtil.js";
import DraggingUtil from "../util/canvas/DraggingUtil.js";
import Canvas from "../view/Canvas.js";
import NodeContainer from "../model/geometric/node/NodeContainer.js";
import DrawingEngine from "../engine/DrawingEngine.js";

export default class SystemCore {
  initializeCanvas() {
    Canvas.setCanvasSize(4000, 2160);
  }

  initializeControllers() {
    this.nodeContainer = new NodeContainer();
    this.nodeController = new NodeController(this.nodeContainer);
    this.selectionController = new SelectionController();
    this.fileHandler = new LocalStorageFileHandler(this.nodeController);
  }

  initializeHandlers() {
    this.keyboardHandler = new KeyboardHandler(this);
    this.topMenuHandler = new TopMenuHandler(this);
    this.mouseHandler = new MouseHandler(this);
  }

  initializeUtilities() {
    ScrollUtil.scrollToCenter();
    DraggingUtil.init();
  }

  initializeEngine() {
    this.drawingEngine = new DrawingEngine(this.nodeContainer);
  }

  startApplication() {
    this.initializeCanvas();
    this.initializeControllers();
    this.initializeEngine();
    this.initializeHandlers();
    this.initializeUtilities();
  }
}
