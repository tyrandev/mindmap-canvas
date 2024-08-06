import * as GlobalConstants from "../../constants/GlobalConstants.js";

export default class KeyboardHandler {
  constructor(mindMap) {
    this.mindMap = mindMap;
    this.canvas = document.getElementById(GlobalConstants.MINDMAP_CANVAS_ID);
    this.nodeController = mindMap.nodeController;
    this.fileHandler = mindMap.fileHandler;
    this.fileInput = mindMap.fileInput;
    this.initKeyListeners();
  }

  initKeyListeners() {
    this.canvas.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.canvas.setAttribute("tabindex", "0"); // Ensure canvas can receive focus
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    console.log("Key pressed:", event.key);

    const handlers = {
      z: this.handleUndo.bind(this),
      y: this.handleRedo.bind(this),
      f3: this.handleToggleCollapse.bind(this),
      f2: this.handleRenameNode.bind(this),
      e: this.handleExportToJson.bind(this),
      b: this.handleOpenLocalStorage.bind(this),
      backspace: this.handleDeleteNode.bind(this),
      delete: this.handleDeleteNode.bind(this),
      tab: this.handleRandomizeColor.bind(this),
      escape: this.handleUnselectNode.bind(this),
      s: this.handleSaveToLocalStorage.bind(this),
      m: this.handleListSavedMindMaps.bind(this),
      p: this.handleLoadMindMap.bind(this),
      d: this.handleDeleteMindMap.bind(this),
      c: this.handleCopyNode.bind(this),
      x: this.handleCutNode.bind(this),
      v: this.handlePasteNode.bind(this),
    };

    if (handlers[key]) {
      event.preventDefault();
      handlers[key](event);
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
    if (this.nodeController.selectedNode) {
      this.nodeController.toggleSelectedNodeCollapse();
    }
  }

  handleRenameNode(event) {
    if (this.nodeController.selectedNode) {
      this.nodeController.renameSelectedNodePrompt();
    }
  }

  handleExportToJson(event) {
    if (event.ctrlKey || event.metaKey) {
      this.fileHandler.exportToJson();
    }
  }

  handleOpenLocalStorage(event) {
    if (event.ctrlKey || event.metaKey) {
      // TODO: create a method which sets
    }
  }

  handleDeleteNode(event) {
    if (this.nodeController.selectedNode) {
      this.nodeController.removeNode(this.nodeController.selectedNode);
    }
  }

  handleRandomizeColor(event) {
    if (this.nodeController.selectedNode) {
      this.nodeController.randomizeSelectedNodeColor();
    }
  }

  handleUnselectNode(event) {
    if (this.nodeController.selectedNode) {
      this.nodeController.unselectNode();
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
