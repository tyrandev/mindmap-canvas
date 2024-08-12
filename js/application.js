import MindMap from "./model/mindmap/MindMap.js";
import ScriptLoader from "./util/script/ScriptLoader.js";

const scriptsToLoad = [
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
];

ScriptLoader.loadScripts(scriptsToLoad)
  .then(() => {
    console.log("All scripts have been loaded");
  })
  .catch((error) => {
    console.error("Error loading scripts:", error);
  });

const mindMap = new MindMap();
mindMap.startApplication();
