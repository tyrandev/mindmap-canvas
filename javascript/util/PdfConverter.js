export default class PdfConverter {
  constructor(
    containerSelector = ".canvas-container",
    defaultFileName = "mindmap"
  ) {
    this.containerSelector = containerSelector;
    this.defaultFileName = defaultFileName;
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener("keydown", this.handleKeydown.bind(this));
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

    html2canvas(container).then((canvas) => {
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
    });
  }
}

// Usage
const pdfConverter = new PdfConverter();
