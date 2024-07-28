export default class PdfConverter {
  constructor(
    containerSelector = "#canvas-container",
    defaultFileName = "mindmap"
  ) {
    if (PdfConverter.instance) {
      return PdfConverter.instance;
    }

    this.containerSelector = containerSelector;
    this.defaultFileName = defaultFileName;
    this.handleKeydown = this.handleKeydown.bind(this);
    this.initEventListeners();

    PdfConverter.instance = this;
  }

  initEventListeners() {
    document.removeEventListener("keydown", this.handleKeydown); // Ensure no duplicate listeners
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(event) {
    if (event.key === "F4") {
      event.preventDefault();
      this.convertDivToPdf();
    }
  }

  convertDivToPdf() {
    const { jsPDF } = window.jspdf;
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
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        // Restore the box-shadow
        container.style.boxShadow = originalBoxShadow;

        // Prompt the user for a file name
        const fileName = prompt(
          "Enter the file name (without .pdf extension):",
          this.defaultFileName
        );

        // Check if the user clicked "Cancel"
        if (fileName === null) {
          return;
        }

        const sanitizedFileName = fileName
          ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
          : this.defaultFileName;

        pdf.save(`${sanitizedFileName}.pdf`);
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
    if (!PdfConverter.instance) {
      PdfConverter.instance = new PdfConverter(
        containerSelector,
        defaultFileName
      );
    }
    return PdfConverter.instance;
  }
}

// Usage
const pdfConverter = PdfConverter.getInstance();
