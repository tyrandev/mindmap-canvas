import MindMap from "./MindMap.js";

const mindMap = new MindMap("mindMapCanvas");

document.addEventListener("DOMContentLoaded", () => {
  mindMap.initialiseParentCircle("Mindmap");
});
