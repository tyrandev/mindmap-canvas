export default class MindmapState {
  static instance = null;

  static getInstance() {
    if (!MindmapState.instance) {
      MindmapState.instance = new MindmapState();
    }
    return MindmapState.instance;
  }

  constructor() {
    if (MindmapState.instance) {
      throw new Error(
        "Singleton classes cannot be instantiated more than once."
      );
    }
    this.currentFilename = null;
    this.currentMindmapJson = null;
  }

  setCurrentMindmap(filename, json) {
    this.currentFilename = this.removeJsonExtension(filename);
    this.currentMindmapJson = json;
    console.log("filename:", this.currentFilename);
  }

  getCurrentMindmap() {
    return {
      filename: this.currentFilename,
      json: this.currentMindmapJson,
    };
  }

  clearCurrentMindmap() {
    this.currentFilename = null;
    this.currentMindmapJson = null;
  }

  removeJsonExtension(filename) {
    if (filename && filename.endsWith(".json")) {
      return filename.slice(0, -5);
    }
    return filename;
  }
}
