import CircleSerializer from "./circle/CircleSerializer.js";

export default class MindMapFileHandler {
  constructor(circleController) {
    this.circleController = circleController;
  }

  saveToJson() {
    const rootCircle = this.circleController.getMotherCircle();
    const json = CircleSerializer.serialize(rootCircle);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Prompt user for the filename
    const filename = prompt(
      "Enter the filename for the JSON file:",
      "mindmap.json"
    );

    // Default to "mindmap.json" if the user cancels the prompt or inputs nothing
    const downloadFilename = filename ? filename : "mindmap.json";

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename; // Use the filename provided by the user or default to "mindmap.json"
    a.click();
    URL.revokeObjectURL(url);
  }

  loadFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target.result;
      const rootCircle = CircleSerializer.deserialize(json);
      this.circleController.resetAllCircles(); // Clear current circles
      this.circleController.addCircleAndChildren(rootCircle); // Add the loaded circle and its children
      this.circleController.drawCircles(); // Redraw circles to reflect the new state
    };
    reader.readAsText(file);
  }
}
