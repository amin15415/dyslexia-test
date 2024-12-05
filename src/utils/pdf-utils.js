import html2pdf from 'html2pdf.js';

  // Function to handle HTML to PDF conversion
 export function convertAndDownloadPDF (contentRef, reportName, name, size) {

    const element = contentRef.current;

    // Options for html2pdf.js
    const options = {
      margin: 10, 
      filename: `${name} - Gryfn AI Dyslexia ${reportName} - ${new Date().toLocaleDateString('en-US')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, dpi: 300, letterRendering: true },
      jsPDF: { unit: 'mm', format: size , orientation: 'landscape' },
    };

    // Convert the content of the element to PDF
    if (element)
        html2pdf().from(element).set(options).save();
  };