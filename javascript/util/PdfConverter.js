export default class PdfConverter {
  static containerSelector = "#canvas-container";
  static defaultFileName = "mindmap";

  static convertDivToPdf() {
    const { jsPDF } = window.jspdf;
    const container = document.querySelector(PdfConverter.containerSelector);

    if (!container) {
      console.error(
        `Container with selector "${PdfConverter.containerSelector}" not found.`
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
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

        container.style.boxShadow = originalBoxShadow;

        const fileName = prompt(
          "Enter the file name (without .pdf extension):",
          PdfConverter.defaultFileName
        );

        if (fileName === null) {
          return;
        }

        const sanitizedFileName = fileName
          ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
          : PdfConverter.defaultFileName;

        pdf.save(`${sanitizedFileName}.pdf`);
      })
      .catch((error) => {
        container.style.boxShadow = originalBoxShadow;
        console.error("Error capturing the container:", error);
      });
  }
}
