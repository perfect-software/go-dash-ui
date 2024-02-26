import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import {
  formatDDMMYYYYDate,
  formatDate,
  formatToLocalDDMMYYYY,
} from "./convertDate";
import DefaultShoesImage from "../assets/notFound.png";
import { ARTICLE_IMAGE_PATH, SAMPLE_REQUEST_IMAGE_PATH } from "./url";

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
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to load image, loading default image:", error);
    const response = await fetch(DefaultShoesImage);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
};
export const generateOnSubmitPDF = async (sampleDetailsForm) => {
  if (!Array.isArray(sampleDetailsForm)) {
    console.error("sampleDetailsForm is not an array");
    return;
  }

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  for (const [index, data] of sampleDetailsForm.entries()) {
    const invoiceElement = document.createElement("div");
    invoiceElement.style.position = "absolute";
    invoiceElement.style.left = "-9999px";
    invoiceElement.style.width = "297mm";
    invoiceElement.style.height = "210mm";
    document.body.appendChild(invoiceElement);
    const sectionHTML = await generateDocumentUI(data, index, sampleDetailsForm.length);
    invoiceElement.innerHTML = `<div style="padding: 14px; color: #000;">${sectionHTML}</div>`;
    const canvas = await html2canvas(invoiceElement, {
      windowWidth: invoiceElement.scrollWidth,
      windowHeight: invoiceElement.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");

    if (index > 0) {
      pdf.addPage();
    }
    pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
    document.body.removeChild(invoiceElement); 
  }
  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
  
};

const generateDocumentUI = async (data, index, totalPages) => {
  const headers = [
    { name: "BUYER ART.NO.", width: "12%" },
    { name: "ART.NO.", width: "8%" },
    { name: "COLOR", width: "15%" },
    { name: "INSOLE", width: "15%" },
    { name: "LAST", width: "15%" },
    { name: "SOLE", width: "15%" },
    { name: "HEEL", width: "15%" },
    { name: "SIZE", width: "5%" },
    { name: "QTY", width: "5%" },
    { name: "OWN", width: "5%" },
    { name: "TOTAL", width: "5%" },
  ];
  const imageSrc = await loadImageBase64(
    `${SAMPLE_REQUEST_IMAGE_PATH}${data.image_nm}`
  );
  const articleImageSrc = await loadImageBase64(
    `${ARTICLE_IMAGE_PATH}${data.article_image}`
  );
  const qrCodeSrc = await generateQR(data.sr_no || "No Reference");
  const now = new Date();
  const currentDate = now.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
 
  const tableRows = [
    [{ content: data.articleNo || "N/A", width: "10%" }],
    [{ content: data.articleNo || "N/A", width: "10%" }],
    [{ content: data.upperColor || "N/A", width: "15%" }],
    [{ content: data.insole || "N/A", width: "15%" }],
    [{ content: data.last || "N/A", width: "15%" }],
    [{ content: data.soleLabel || "N/A", width: "15%" }],
    [{ content: data.heel || "N/A", width: "15%" }],
    [{ content: data.size || "N/A", width: "5%" }],
    [{ content: data.quantity || "N/A", width: "5%" }],
    [{ content: data.own || "N/A", width: "5%" }],
    [{ content: data.total || "N/A", width: "5%" }],
  ];
  

  const generateHeaders = (headers) => {
    return `
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        <tr>
          ${headers
            .map(
              (header) => `
              <th style="word-wrap: break-word; text-align: center; padding: 2px; border: 0; font-size: 13px; font-weight: bold; width: ${header.width};">${header.name}</th>
              `
            )
            .join("")}
        </tr>
      </table>
    `;
  };
  const generateTable = (rows) => {
    return `
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
      <tr>
        ${rows.map(row => `
         
            ${row.map(cell => `
              <td style="text-align:center; vertical-align: top; padding: 5px; border: 0; font-size: 13px; word-wrap: break-word; width: ${cell.width};">
                ${cell.content}
              </td>
            `).join('')}
        
        `).join('')}
        </tr>
      </table>
    `;
  };
  

  return ` <div key=${index} style="font-family: Arial, sans-serif; page-break-after: always;">
  <div style="display: flex; flex-direction:column;  ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1>GUPTA H.C. OVERSEAS (I) PVT. LTD</h1>
          <p>SAMPLE ORDER/SPECIFICATION SHEET</p>
          <div style="display:flex; gap:10px;">
          <p style="font-size: 11px;">DATE: ${currentDate}</p>
          <p style="font-size: 11px;">Time: ${currentTime}</p>
          <p style="font-size: 11px;">Page ${index + 1} of ${totalPages}</p>
          </div>
        </div>
        <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
        <div style="display: flex; justify-content: space-between; width:100%; align-items: top;font-size: 15px; ">
           <div style="display: flex; flex-direction:column; width:34%">
           <p style="word-wrap: break-word; "><strong style="margin-right:12px;">BUYER NAME</strong> : ${data.buyer.bsName}</p>
           <p style="word-wrap: break-word; "><strong>INTERNAL REF</strong> : ${data.internal_ref || "N/A"}</p>
           <p style="word-wrap: break-word; "><strong style="margin-right:27px;">BUYER REF</strong> : ${data.internal_ref || "N/A"}</p>
           <p><strong>INITIAL</strong></p>
           </div>


           <div style="display: flex; flex-direction:column; margin-right:160px; align-items:center;  ">
           <strong>SR NO : ${data.sr_no || "N/A"}</strong>
           <p><strong>TYPE OF SAMPLE : </strong>${data.sampleType || "N/A"}</p>
           <div style="display:flex; gap:10px;">
           <p><strong>PATTERN : </strong>${data.pattern || "N/A"}</p>
           <p><strong>SEASON : </strong>${data.season || "N/A"}</p>
           </div>
           </div>

           <div style="display: flex; flex-direction:column;  ">
           <p><strong style="margin-right:11px;">DATE OF ORDER</strong> : ${formatDDMMYYYYDate(data.dateOfOrder) || "N/A"}</p>
           <p><strong>PROD EX-FACT Dt</strong> : ${formatDDMMYYYYDate(data.prodExDate) || "N/A"}</p>
           <p><strong style="margin-right:18.7px;">DELIVERY DATE</strong> : ${formatDDMMYYYYDate(data.deliveryDate) || "N/A"}</p>
           </div>

        </div>
       
      
      </div>
      <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
      ${generateHeaders(headers)}
      <div style="border-top: 2px solid #000; margin-top: 5px;"></div>
      ${generateTable(tableRows)}
      <div style="border-top: 2px solid #000; margin-top: 5px;"></div>
      <div style="display:flex; width:100%;  justify-content: space-between ;align-items: center;  font-size: 13px;  ">
       <div style="display:flex; flex-direction:column;" >
       <p><strong style="margin-right:2px">UPPER</strong> : ${data.upperColor || "N/A"}</p>
       <p><strong>LINING</strong> : ${data.liningColor || "N/A"}</p>
       </div>
       <div style="display:flex; flex-direction:column;" >
       <p><strong>SOLE LABEL</strong> : ${data.soleLabel || "N/A"}</p>
       <p><strong style="margin-right:44px">SOCK</strong> : ${data.socks || "N/A"}</p>
       </div>
       <div style="display:flex;flex-direction:column; width:65%;">
       <p style="word-wrap: normal;"><strong style="margin-right:24px">SOLE REMARK</strong> : ${data.sole_remark|| "N/A"}</p>
       <p style="word-wrap: break-word;"><strong>LEATHER REMARK</strong> : ${data.leather_remark|| "N/A"}</p>
       </div>
       </div>
       <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
      <div style="display: flex; margin-top: 2px;">
      <div style="display: flex;flex-direction:column;width:60%;">
        <div style="display: flex; gap:20px;  font-size: 13px; ">
        <p><strong>Buyer Upper Color : </strong>${data.upperColor || "N/A"}</p>
        <p><strong>Buyer Lining Color : </strong>${data.liningColor || "N/A"}</p>
        </div>
        <div style="margin-top:20px;">
        <strong style="font-size: 18px; word-wrap: break-word; margin-right:30px">${data.comments || "N/A"}</strong>
        </div>
        </div>
        <div style="width:50%; display: flex; margin-top:20px; justify-content: end;">
        <div style="border: 2px solid black; padding: 2px; display: flex;align-items:center;justify-content:center">
        <img src="${qrCodeSrc}" alt="QR Code" style="width: 140px; height: 140px" />
    </div>
    <div style="border: 2px solid black; padding: 2px; display: flex; flex-direction:column;align-items:center; margin-left: 10px;justify-content:center">
        <img src="${imageSrc}" alt="Sample Image" style="width: 140px; height: 140px" />
        <p style="font-size: 12px;margin-bottom:5px">SR Image</p>
    </div>
    <div style="border: 2px solid black; padding: 2px; display: flex; align-items:center;  flex-direction:column; margin-left: 10px;justify-content:center">
        <img src="${articleImageSrc}" alt="Sample Image" style="width: 140px; height: 140px" />
        <p style="font-size: 12px; margin-bottom:5px ">Article Image</p>
    </div>
    
    </div>
   
      </div>
      <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top:30px">
    <div style="text-align: left;">
      <p style="color: #000;">Seller Signature</p>
      <div style="width: 180px; height: 40px; border: 1px solid #000000; margin-top: 15px;"></div>
    </div>
    <div style="text-align: right;">
      <p style="color: #000;">Merchandiser Signature</p>
      <div style="width: 180px; height: 40px; border: 1px solid #000000; margin-top: 15px;"></div>
    </div>
        </div>
`;
};
const InvoiceComponent = () => null;

export default InvoiceComponent;
