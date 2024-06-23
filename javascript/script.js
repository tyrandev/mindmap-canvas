import MindMap from "./MindMap.js";
import Circle from "./circle/Circle.js";

const mindMap = new MindMap("mindMapCanvas");

document.addEventListener("DOMContentLoaded", () => {
  mindMap.initialiseParentCircle("Mindmap");
});
