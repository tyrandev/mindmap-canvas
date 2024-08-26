import fileInputManager from "../../util/file/FileInputManager.js";

export default class LocalStorageUIHandler {
  constructor(MindmapFileHandler) {
    this.MindmapFileHandler = MindmapFileHandler;
    this.setupFileInput();
    this.createLocalStorageList();
  }

  setupFileInput() {
    this.fileInput = fileInputManager.getFileInput();
    this.fileInput.addEventListener(
      "change",
      this.handleFileInputChange.bind(this)
    );
  }

  handleFileInputChange(event) {
    this.MindmapFileHandler.loadFromJson(event);
  }

  createLocalStorageList() {
    const mindmapListDiv = this.getMindmapListDiv();
    if (!mindmapListDiv) return;

    this.clearMindmapListDiv(mindmapListDiv);
    const mindmaps = this.MindmapFileHandler.listSavedMindMaps();
    mindmaps.forEach((name) => {
      const itemDiv = this.createMindmapListItem(name);
      mindmapListDiv.appendChild(itemDiv);
    });
  }

  getMindmapListDiv() {
    const mindmapListDiv = document.getElementById("local-storage-list");
    if (!mindmapListDiv) {
      console.error('No div with id "local-storage-list" found.');
    }
    return mindmapListDiv;
  }

  clearMindmapListDiv(mindmapListDiv) {
    mindmapListDiv.innerHTML = "";
  }

  createMindmapListItem(name) {
    const div = this.createElementWithClass("div", "local-storage-item");
    const nameSpan = this.createElementWithClass(
      "span",
      "local-storage-item-name",
      name
    );
    div.appendChild(nameSpan);
    this.addLoadEventListener(div, name);
    div.appendChild(this.createRenameButton(name));
    div.appendChild(this.createDeleteButton(name));
    return div;
  }

  createElementWithClass(tag, className, textContent = "") {
    const element = document.createElement(tag);
    element.classList.add(className);
    if (textContent) element.textContent = textContent;
    return element;
  }

  addLoadEventListener(element, name) {
    element.addEventListener("click", () => {
      this.MindmapFileHandler.loadFromLocalStorage(name);
    });
  }

  createRenameButton(name) {
    const button = this.createElementWithClass(
      "button",
      "rename-button-local-storage",
      "Rename"
    );
    button.classList.add("button-local-storage");
    this.addRenameEventListener(button, name);
    return button;
  }

  addRenameEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      this.handleRename(name);
    });
  }

  handleRename(name) {
    const newName = prompt(`Enter a new name for "${name}":`);
    if (newName) {
      this.MindmapFileHandler.renameInLocalStorage(name, newName);
      this.createLocalStorageList();
    }
  }

  createDeleteButton(name) {
    const button = this.createElementWithClass(
      "button",
      "delete-button-local-storage",
      "X"
    );
    button.classList.add("button-local-storage");
    this.addDeleteEventListener(button, name);
    return button;
  }

  addDeleteEventListener(button, name) {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      this.handleDelete(name);
    });
  }

  handleDelete(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.MindmapFileHandler.deleteFromLocalStorage(name);
      this.createLocalStorageList();
    }
  }
}
