export default class ImgConverter {
  static containerSelector = "#canvas-container";
  static defaultFileName = "mindmap";

  static convertDivToImage() {
    const container = document.querySelector(ImgConverter.containerSelector);

    if (!container) {
      console.error(
        `Container with selector "${ImgConverter.containerSelector}" not found.`
      );
      return;
    }

    const scale = window.devicePixelRatio || 1;
    const originalBoxShadow = container.style.boxShadow;
    container.style.boxShadow = "none";

    html2canvas(container, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        container.style.boxShadow = originalBoxShadow;

        const link = document.createElement("a");

        const fileName = prompt(
          "Enter the file name (without .png extension):",
          ImgConverter.defaultFileName
        );

        if (fileName === null) {
          return;
        }

        const sanitizedFileName = fileName
          ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
          : ImgConverter.defaultFileName;

        link.href = imgData;
        link.download = `${sanitizedFileName}.png`;

        link.click();
      })
      .catch((error) => {
        container.style.boxShadow = originalBoxShadow;
        console.error("Error capturing the container:", error);
      });
  }
}
