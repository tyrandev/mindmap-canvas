document.addEventListener("keydown", function (event) {
  if (event.key === "F4") {
    // Prevent default action if necessary
    event.preventDefault();

    // Function to convert the div content to PDF
    const { jsPDF } = window.jspdf;

    html2canvas(document.querySelector(".canvas-container")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape", // Set orientation to landscape
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Prompt the user for a file name
      const fileName = prompt(
        "Enter the file name (without extension):",
        "mindmap"
      );
      const sanitizedFileName = fileName
        ? fileName.replace(/[\/\\?%*:|"<>]/g, "_")
        : "mindmap";

      pdf.save(`${sanitizedFileName}.pdf`);
    });
  }
});
