export default class FileDropHandler {
  // Static method to initialize the drag-and-drop functionality
  static initialize() {
    const canvasContainer = document.querySelector("#canvas-container");

    // Prevent default behavior (Prevent file from being opened)
    canvasContainer.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    // Handle file drop
    canvasContainer.addEventListener("drop", async (event) => {
      event.preventDefault();

      // Get the files from the event
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];

        // Check if the file is a JSON file
        if (file.type === "application/json") {
          try {
            // Read the file content
            const content = await file.text();
            const jsonData = JSON.parse(content);
            // Print the JSON content to the console
            console.log(jsonData);
          } catch (error) {
            console.error("Error reading or parsing the JSON file:", error);
          }
        } else {
          console.error("Please drop a valid JSON file.");
        }
      }
    });
  }
}

// // Initialize the FileDropHandler when the document is ready
// document.addEventListener("DOMContentLoaded", () => {
//   FileDropHandler.initialize();
// });
