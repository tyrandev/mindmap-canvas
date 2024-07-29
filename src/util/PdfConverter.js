import MediaConverter from "./MediaConverter.js";

export default class PdfConverter extends MediaConverter {
  static async convertDivToPdf() {
    const { jsPDF } = window.jspdf;
    const canvas = await this.captureContainer();
    if (!canvas) return;
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
    const fileName = this.promptFileName("pdf", this.defaultFileName);
    if (!fileName) return;
    pdf.save(`${fileName}.pdf`);
  }
}
