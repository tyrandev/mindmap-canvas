export default class CircleStackManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
    this.motherCircleState = [];
  }

  saveStateForUndo(motherCircle) {
    if (motherCircle) {
      this.undoStack.push(motherCircle.clone());
      this.redoStack = [];
    }
  }

  undo(currentMotherCircle, restoreStateCallback) {
    if (this.undoStack.length > 0) {
      const state = this.undoStack.pop();
      this.redoStack.push(currentMotherCircle.clone());
      restoreStateCallback(state);
    }
  }

  redo(currentMotherCircle, restoreStateCallback) {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop();
      this.undoStack.push(currentMotherCircle.clone());
      restoreStateCallback(state);
    }
  }

  addMotherCircleState(motherCircle) {
    if (motherCircle) {
      this.motherCircleState.push(motherCircle.clone());
    }
  }

  // restoreMotherCircleState(
  //   resetAllCirclesCallback,
  //   addCircleAndChildrenCallback,
  //   drawCirclesCallback
  // ) {
  //   if (this.motherCircleState.length === 0) {
  //     console.log("No mother circle state to restore.");
  //     return;
  //   }
  //   const lastState = this.motherCircleState[this.motherCircleState.length - 1];
  //   resetAllCirclesCallback();
  //   addCircleAndChildrenCallback(lastState);
  //   drawCirclesCallback();
  // }

  clearAllStacks() {
    this.undoStack = [];
    this.redoStack = [];
    this.motherCircleState = [];
    console.log("All stacks cleared.");
  }
}
