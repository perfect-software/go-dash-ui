import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { formatDate } from "../features/convertDate";

const generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    console.error("Error generating QR Code:", err);
    return "";
  }
};

const loadImageBase64 = async (src) => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load image:", error);
    return "";
  }
};

export const generatePDF = async (sampleDetailsForm, imageUrl, sr) => {


  if (!Array.isArray(sampleDetailsForm)) {
    console.error('sampleDetailsForm is not an array');
    return;
  }
  const qrCodeBase64 = await generateQR(sampleDetailsForm.sampleRef || "No Reference");
  const now = new Date();
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const currentDate = now.toLocaleDateString("en-GB", dateOptions);
  const currentTime = now.toLocaleTimeString("en-GB", timeOptions);// Simplified time format

  const tableRows = [
    ['ARTICLE NO.', sampleDetailsForm.articleNo, 'COLOR', sampleDetailsForm.color],
    ['UPPER', sampleDetailsForm.upper, 'LINING', sampleDetailsForm.lining],
  ];

  // Generate table HTML
  const generateTable = (rows) => {
    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
          ${rows.map(row => `
            <tr>
              ${row.map(cell => `<td style="border: 1px solid #000; padding: 4px;">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  };

  const invoiceElement = document.createElement("div");
  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.width = "297mm";
  invoiceElement.style.height = "210mm";
  document.body.appendChild(invoiceElement);

  const totalPages = sampleDetailsForm.length;
  const documentSections = sampleDetailsForm.map((data, index) =>
    generateDocumentUI(data, index, totalPages)
  ).join('');

  const generateDocumentUI = (data, index, totalPages) => {
    const tableRows = [
      ['ARTICLE NO.', data.articleNo, 'COLOR', data.color],
      ['UPPER', data.upper, 'LINING', data.lining],
      // ... add more rows as needed based on the structure of 'data'
    ];
  
  

  return ` <div key=${index} style="font-family: Arial, sans-serif; page-break-after: always;">
  <div style="display: flex;  ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1>GUPTA H.C. OVERSEAS (I) PVT. LTD</h1>
          <p>SAMPLE ORDER/SPECIFICATION SHEET</p>
          <p>${data.season || 'N/A'}</p>
          <p>DATE: ${currentDate}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>SCUM</h2>
          <p>PLAN NO : ${data.sr_no || 'N/A'}</p>
          <p>PHOTO SAMPLE</p>
          <p>Time: ${currentTime}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>SCUM</h2>
          <p>INTERNAL REF :  MAIL TO DTD</p>
          <p>PHOTO</p>
          <p>Page ${index + 1} of ${totalPages}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <p>DATE: ${currentDate}</p>
        <pKIND ATTN : </p>
        <p>PROD EX-FEACT Dt : ${data.prodExDate || 'N/A'}</p>
        <p>Delivery Date : ${data.deliveryDate || 'N/A'}</p>
      </div>
      </div>
      ${generateTable(tableRows)}
  <p style="text-align: center;">${data.comments}</p>
  <div style="text-align: center;">
    <img src="${data.imageSrc}" alt="Sample Image" style="width: 200px; height: auto;" />
  </div>
  <p style="text-align: center;">${data.footer}</p>
</div>
  `;
}
 invoiceElement.innerHTML = `<div style="padding: 14px; color: #000;">${documentSections}</div>`

  const canvas = await html2canvas(invoiceElement);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  pdf.addImage(imgData, "PNG", 0, 0, 297, 210);

  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  window.open(pdfUrl, '_blank');

  const downloadLink = document.createElement("a");
  downloadLink.href = pdfUrl;
  downloadLink.download = `${sr}.pdf`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  document.body.removeChild(invoiceElement); // Clean-up
};

const InvoiceComponent = () => null;

export default InvoiceComponent;
