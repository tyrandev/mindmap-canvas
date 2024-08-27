export default class DragAndDropHandler {
  constructor() {
    this._initializeDragAndDrop();
  }

  _initializeDragAndDrop() {
    document.body.addEventListener("dragover", this._handleDragOver.bind(this));
    document.body.addEventListener("drop", this._handleDrop.bind(this));
  }

  _handleDragOver(event) {
    event.preventDefault(); // Necessary to allow the drop
  }

  _handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      this._loadFromFile(file);
    }
  }

  _loadFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      this._dispatchFileLoadEvent(json, file.name);
    };
    reader.readAsText(file);
  }

  _dispatchFileLoadEvent(json, filename) {
    const event = new CustomEvent("fileLoaded", {
      detail: { json, filename },
    });
    document.dispatchEvent(event);
  }
}
