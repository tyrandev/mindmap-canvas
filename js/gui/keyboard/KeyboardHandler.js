import Canvas from "../../util/canvas/Canvas.js";
import StorageUtil from "../../util/storage/StorageUtil.js";
import MouseModeManager from "../mouse/MouseModeManager.js";
import * as MouseConstants from "../../constants/MouseConstants.js";

export default class KeyboardHandler {
  constructor(systemCore) {
    this.systemCore = systemCore;
    this.canvas = Canvas.getCanvas();
    this.nodeController = systemCore.nodeController;
    this.selectionManager = systemCore.selectionManager;
    this.fileHandler = systemCore.fileHandler;
    this.fileInput = systemCore.fileInput;
    this.initKeyListeners();
  }

  initKeyListeners() {
    this.canvas.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.canvas.addEventListener("keyup", this.handleShiftKeyUp.bind(this));
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    console.log("Key pressed:", event.key);

    const handlers = {
      f2: this.handleRenameNode.bind(this),
      f3: this.handleToggleCollapse.bind(this),
      backspace: this.handleDeleteNode.bind(this),
      delete: this.handleDeleteNode.bind(this),
      tab: this.handleRandomizeColor.bind(this),
      escape: this.handleUnselectNode.bind(this),
      shift: this.handleShiftKeyDown.bind(this),
      z: this.handleUndo.bind(this),
      y: this.handleRedo.bind(this),
      e: this.handleExportToJson.bind(this),
      b: this.handleOpenLocalStorage.bind(this),
      s: this.handleSaveToLocalStorage.bind(this),
      m: this.handleListSavedMindMaps.bind(this),
      p: this.handleLoadMindMap.bind(this),
      d: this.handleDeleteMindMap.bind(this),
      c: this.handleCopyNode.bind(this),
      x: this.handleCutNode.bind(this),
      v: this.handlePasteNode.bind(this),
      o: this.handleCenterMindmap.bind(this),
      r: this.handleresetMindmap.bind(this),
    };

    if (handlers[key]) {
      event.preventDefault();
      handlers[key](event);
    }
  }

  handleresetMindmap(event) {
    if (event.ctrlKey) {
      this.nodeController.resetMindmap();
    }
  }

  handleCenterMindmap(event) {
    if (event.ctrlKey) {
      this.nodeController.moveRootNodeToCenter();
    }
  }

  handleShiftKeyUp(event) {
    if (event.key === "Shift") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleShiftKeyDown(event) {
    if (event.type === "keydown") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.GRABBING_MINDMAP);
      console.log("Dragging is on");
    } else if (event.type === "keyup") {
      MouseModeManager.setMode(MouseConstants.MOUSE_MODES.NORMAL);
    }
  }

  handleUndo(event) {
    if (event.ctrlKey) {
      this.nodeController.undo();
    }
  }

  handleRedo(event) {
    if (event.ctrlKey) {
      this.nodeController.redo();
    }
  }

  handleToggleCollapse(event) {
    if (this.selectionManager.getSelectedNode()) {
      this.selectionManager.toggleSelectedNodeCollapse();
    }
  }

  handleRenameNode(event) {
    if (this.selectionManager.getSelectedNode()) {
      this.selectionManager.renameSelectedNodePrompt();
    }
  }

  handleExportToJson(event) {
    if (event.ctrlKey || event.metaKey) {
      this.fileHandler.exportToJson();
    }
  }

  handleOpenLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      StorageUtil.toggleStorageContainerDisplay();
    }
  }

  handleDeleteNode(event) {
    if (this.selectionManager.getSelectedNode()) {
      this.nodeController.removeNode(this.selectionManager.getSelectedNode());
    }
  }

  handleRandomizeColor(event) {
    if (this.selectionManager.getSelectedNode()) {
      this.selectionManager.randomizeSelectedNodeColor();
    }
  }

  handleUnselectNode(event) {
    if (this.selectionManager.getSelectedNode()) {
      this.selectionManager.unselectNode();
    }
  }

  handleSaveToLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      this.fileHandler.saveToLocalStorage();
    }
  }

  handleListSavedMindMaps(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      this.fileHandler.createLocalStorageList();
      alert("Saved mind maps:\n" + savedMindMaps.join("\n"));
    }
  }

  handleLoadMindMap(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      const selectedMap = prompt(
        "Enter the name of the mind map to load:",
        savedMindMaps.join(", ")
      );
      if (selectedMap) {
        this.fileHandler.loadFromLocalStorage(selectedMap);
      }
    }
  }

  handleDeleteMindMap(event) {
    if (event.ctrlKey || event.metaKey) {
      const savedMindMaps = this.fileHandler.listSavedMindMaps();
      const mapToDelete = prompt(
        "Enter the name of the mind map to delete:",
        savedMindMaps.join(", ")
      );
      if (mapToDelete) {
        this.fileHandler.deleteFromLocalStorage(mapToDelete);
        alert(`Mind map '${mapToDelete}' has been deleted.`);
      }
    }
  }

  handleCopyNode(event) {
    if (event.ctrlKey || event.metaKey) {
      // this.nodeController.copySelectedNode();
    }
  }

  handleCutNode(event) {
    if (event.ctrlKey || event.metaKey) {
      // this.nodeController.cutSelectedNode();
    }
  }

  handlePasteNode(event) {
    if (event.ctrlKey || event.metaKey) {
      // this.nodeController.pasteSelectedNode();
    }
  }
}
