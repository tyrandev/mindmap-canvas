class FileInputManager {
  constructor() {
    if (!FileInputManager.instance) {
      this.fileInput = document.createElement("input");
      this.fileInput.type = "file";
      this.fileInput.accept = ".json";
      this.fileInput.style.display = "none";
      document.body.appendChild(this.fileInput);
      FileInputManager.instance = this;
    }
    return FileInputManager.instance;
  }

  getFileInput() {
    return this.fileInput;
  }

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);
          resolve(json);
        } catch (error) {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  }
}

const instance = new FileInputManager();
Object.freeze(instance);

export default instance;
