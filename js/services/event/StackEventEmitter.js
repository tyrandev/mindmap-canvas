import EventEmitter from "./EventEmitter.js";

class StackEventEmitter extends EventEmitter {
  constructor() {
    super();
    if (!StackEventEmitter.instance) {
      StackEventEmitter.instance = this;
    }
    return StackEventEmitter.instance;
  }

  emitSaveState() {
    this.emit("saveStateForUndo");
    console.log("save state event emitted.");
  }

  emitUndo() {
    this.emit("undo");
  }

  emitRedo() {
    this.emit("redo");
  }

  emitClearAllStacks() {
    this.emit("clearAllStacks");
  }
}

const instance = new StackEventEmitter();
export default instance;
