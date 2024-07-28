export default class ImgConverter {
  constructor(
    containerSelector = "#canvas-container",
    defaultFileName = "mindmap"
  ) {
    if (ImgConverter.instance) {
      return ImgConverter.instance;
    }

    this.containerSelector = containerSelector;
    this.defaultFileName = defaultFileName;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.initEventListeners();

    ImgConverter.instance = this;
  }

  initEventListeners() {
    document.removeEventListener("keydown", this.handleKeydown); // Ensure no duplicate listeners
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(event) {
    if (event.key === "F5") {
      event.preventDefault();
      this.convertDivToImage();
    }
  }

  convertDivToImage() {
    const container = document.querySelector(this.containerSelector);

    if (!container) {
      console.error(
        `Container with selector "${this.containerSelector}" not found.`
      );
      return;
    }

    // Adjust scale based on the current zoom level
    const scale = window.devicePixelRatio || 1;

    // Temporarily remove the box-shadow
    const originalBoxShadow = container.style.boxShadow;
    container.style.boxShadow = "none";

    html2canvas(container, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Restore the box-shadow
        container.style.boxShadow = originalBoxShadow;

        // Create an anchor element for download
        const link = document.createElement("a");

        // Prompt the user for a file name
        const fileName = prompt(
          "Enter the file name (without .png extension):",
          this.defaultFileName
        );

        // Check if the user clicked "Cancel"
        if (fileName === null) {
          return;
        }

        const sanitizedFileName = fileName
          ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
          : this.defaultFileName;

        link.href = imgData;
        link.download = `${sanitizedFileName}.png`;

        // Programmatically click the link to trigger the download
        link.click();
      })
      .catch((error) => {
        // Restore the box-shadow in case of an error
        container.style.boxShadow = originalBoxShadow;
        console.error("Error capturing the container:", error);
      });
  }

  static getInstance(
    containerSelector = "#canvas-container",
    defaultFileName = "mindmap"
  ) {
    if (!ImgConverter.instance) {
      ImgConverter.instance = new ImgConverter(
        containerSelector,
        defaultFileName
      );
    }
    return ImgConverter.instance;
  }
}
