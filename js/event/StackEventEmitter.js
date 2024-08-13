import EventEmitter from "./EventEmitter.js";

class StackEventEmitter extends EventEmitter {
  constructor() {
    super();
    if (!StackEventEmitter.instance) {
      StackEventEmitter.instance = this;
      this.rootNode = null;
    }
    return StackEventEmitter.instance;
  }

  setRootNode(rootNode) {
    this.rootNode = rootNode;
  }

  getRootNode() {
    return this.rootNode;
  }

  emitSaveState() {
    if (this.rootNode) {
      this.emit("saveStateForUndo", this.rootNode);
    } else {
      console.warn("Root node is not set.");
    }
  }

  emitUndo() {
    this.emit("undo");
  }

  emitRedo() {
    this.emit("redo");
  }
}

const instance = new StackEventEmitter();
export default instance;
