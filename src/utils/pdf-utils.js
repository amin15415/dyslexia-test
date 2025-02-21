import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

  // Function to handle HTML to PDF conversion
 export async function convertAndDownloadPDF (contentRefs, reportName, name, width, height) {

    
    const pdfPages = [];

    // Options for html2pdf.js
    const options = {
      margin: 10, 
      filename: `${name} -  ${reportName} - ${new Date().toLocaleDateString('en-US')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, dpi: 300, letterRendering: true, width: width, height: height },
      jsPDF: { unit: 'mm', format: "a4" , orientation: 'portrait' },
    };

    for (let index in contentRefs) {
      const element = contentRefs[index].current;
      if (element) {
        const canvas = await html2canvas(element,options['html2canvas']);
        const imgData = canvas.toDataURL("image/jpeg");

        const pdfPage = {
          imgData,
          width: canvas.width,
          height: canvas.height
        };

        pdfPages.push(pdfPage);
      }
      
    }

    const doc = new jsPDF("portrait", "px", "a4");

    pdfPages.forEach((page, index) => {
      const imgProps = doc.getImageProperties(page.imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (index > 0) {
        doc.addPage();
      }

      doc.addImage(page.imgData, "JPEG", 10, 10, pdfWidth, pdfHeight);
    });

    doc.save(options.filename);

    // Convert the content of the element to PDF
    // if (element)
    //     html2pdf().from(element).set(options).save();
  };