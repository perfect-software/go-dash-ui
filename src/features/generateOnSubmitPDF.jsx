import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { formatDDMMYYYYDate, formatDate, formatToLocalDDMMYYYY } from "./convertDate";

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

export const generateOnSubmitPDF = async (sampleDetailsForm) => {


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
  const currentTime = now.toLocaleTimeString("en-GB", timeOptions);
  
  // Generate table HTML

  const invoiceElement = document.createElement("div");
  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.width = "297mm";
  invoiceElement.style.height = "210mm";
  document.body.appendChild(invoiceElement);



  const generateDocumentUI = (data, index, totalPages) => {
    const headers = ['B Style', 'Article No', 'color', 'Upper', 'Lining', 'Insole','Sock/Label', 'Last','Sole','Heel', 'Size','Quantity','Own', 'TOTA'];
  
  // Define rows of data aligned with headers
  const tableRows = [
    [data.upperColor || 'N/A'],
    [data.articleNO || 'N/A'],
    [data.upperColor || 'N/A'],
    [data.upperColor || 'N/A'],
    [data.liningColor || 'N/A'],
    [data.insole || 'N/A'],
    [data.inSocks || 'N/A'],
    [data.last || 'N/A'],
    [data.insole || 'N/A'],
    [data.size || 'N/A'],
    [data.quantity || 'N/A'],
    [data.upperColor || 'N/A'],
    [data.pattern || 'N/A'], 
    [data.inQuantity || 'N/A'],
  ];

  const generateHeaders = (headers) => {
    return `
    <div style="display: flex; justify-content: space-between;">
      ${headers.map(header => `
        <p style="flex: 1; text-align: center; margin: 0; font-size: small;">${header}</p>
      `).join('')}
    </div>
  `;
  };

  // Generate table rows
  const generateTable = (rows) => {
    return `
    <div style="display: flex; justify-content: space-between;">
      ${rows.map(row => `
        <p style="flex: 1; text-align: center; margin: 0; font-size: small;">${row}</p>
      `).join('')}
    </div>
  `;
  };
  

  return ` <div key=${index} style="font-family: Arial, sans-serif; page-break-after: always;">
  <div style="display: flex; flex-direction:column;  ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1>GUPTA H.C. OVERSEAS (I) PVT. LTD</h1>
          <p>SAMPLE ORDER/SPECIFICATION SHEET</p>
          <p>${data.season || 'N/A'}</p>
          <p>DATE: ${currentDate}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2>SCUM</h2>
          <strong>PLAN NO : ${data.sr_no || 'N/A'}</strong>
          <p>PHOTO SAMPLE</p>
          <p>Time: ${currentTime}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <p>INTERNAL REF :  MAIL TO DTD</p>
          <p>PHOTO</p>
          <p>Page ${index + 1} of ${totalPages}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <p>DATE: ${currentDate}</p>
        <p>KIND ATTN : </p>
        <p>PROD EX-FEACT Dt : ${formatDDMMYYYYDate(data.prodExDate) || 'N/A'}</p>
        <p>Delivery Date : ${formatDDMMYYYYDate(data.deliveryDate) || 'N/A'}</p>
      </div>
      </div>
      <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
      ${generateHeaders(headers)}
      <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
      ${generateTable(tableRows)}
        <div style="display: flex; ">
        <div style="display: flex;flex-direction:column;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
          <p>Buyer Upper Color : ${data.upperColor || 'N/A'}</p>
          <p>Buyer Lining Color : ${data.upperColor || 'N/A'}</p></div>
          <div>
          <div>
          <p>Comment : ${data.comments || 'N/A'}</p>
          <div>
          </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1>GUPTA H.C. OVERSEAS (I) PVT. LTD</h1>
      <p>SAMPLE ORDER/SPECIFICATION SHEET</p>
      <p>${data.season || 'N/A'}</p>
      <p>DATE: ${currentDate}</p>
    </div>
        </div>
  <div style="text-align: center;">
    <img src="${data.imageSrc}" alt="Sample Image" style="width: 200px; height: auto;" />
  </div>
  <p style="text-align: center;">${data.footer}</p>
</div>
  `;
}

const totalPages = sampleDetailsForm.length;
const documentSections = sampleDetailsForm.map((data, index) =>
  generateDocumentUI(data, index, totalPages)
).join('');
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

  // const downloadLink = document.createElement("a");
  // downloadLink.href = pdfUrl;
  // downloadLink.download = `${sr}.pdf`;
  // document.body.appendChild(downloadLink);
  // downloadLink.click();
  // document.body.removeChild(downloadLink);
  document.body.removeChild(invoiceElement);
};

const InvoiceComponent = () => null;

export default InvoiceComponent;
