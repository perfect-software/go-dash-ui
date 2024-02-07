import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import DefaultShoesImage from "../assets/notFound.png";
import {
  formatDDMMYYYYDate,
} from "./convertDate";

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
export const generatePDF = async (sampleDetailsForm,image_url,sr_no) => {
  const now = new Date();
  const currentDate = now.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log(image_url);
  const imageSrc = await loadImageBase64(
    `http://localhost:8081/images/sample_request/${image_url}`
  );
  const qrCodeSrc = await generateQR(sr_no || "No Reference");
  const currentTime = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const headers = [
    "BUYER ART.NO.",
    "ART.NO.",
    "COLOR",
    "INSOLE",
    "LAST",
    "SOLE",
    "HEEL",
    "SIZE",
    "QTY",
    "OWN",
    "TOTAL",
  ];
  const tableRows = [
    [sampleDetailsForm.articleNo || "N/A"],
    [sampleDetailsForm.articleNo || "N/A"],
    [sampleDetailsForm.upperColor || "N/A"],
    [sampleDetailsForm.insole || "N/A"],
    [sampleDetailsForm.last || "N/A"],
    [sampleDetailsForm.soleLabel || "N/A"],
    [sampleDetailsForm.heel || "N/A"],
    [sampleDetailsForm.size || "N/A"],
    [sampleDetailsForm.quantity || "N/A"],
    [sampleDetailsForm.own || "N/A"],
    [sampleDetailsForm.total || "N/A"],
  ];

  const generateHeaders = (headers) => {
    return `
  <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
    <tr>
      ${headers
        .map(
          (header) => `
          <th style="word-wrap: break-word; text-align: center; padding: 2px; border: 0; font-size: 13px; font-weight: bold;">${header}</th>

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
      ${rows
        .map(
          (row) => `
        <td style="text-align:center;vertical-align: top; padding: 5px; border: 0; font-size: 13px; word-wrap: break-word;">${row}</td>
      `
        )
        .join("")}
    </tr>
  </table>
`;
  };
  const invoiceElement = document.createElement("div");
  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.width = "297mm";
  invoiceElement.style.height = "210mm";
  document.body.appendChild(invoiceElement);

  invoiceElement.innerHTML =`<div style="font-family: Arial, sans-serif; padding:14px; page-break-after: always;">
  <div style="display: flex; flex-direction:column;  ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1>GUPTA H.C. OVERSEAS (I) PVT. LTD</h1>
          <p>SAMPLE ORDER/SPECIFICATION SHEET</p>
          <div style="display:flex; gap:10px;">
          <p>DATE: ${currentDate}</p>
          <p>Time: ${currentTime}</p>
          <p>Page 1 of 1</p>
          </div>
        </div>
        <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
           <div style="display: flex; flex-direction:column;  " >
           <p><strong>BUYER Name : </strong>${sampleDetailsForm.buyer.bsName}</p>
           <p><strong>INTERNAL REF : </strong>${sampleDetailsForm.internal_ref || "N/A"}</p>
           <p><strong>BUYER REF : </strong>${sampleDetailsForm.internal_ref || "N/A"}</p>
           <p><strong>INITIAL </strong></p>
           </div>


           <div style="display: flex; flex-direction:column; align-items:center;  ">
           <strong>SR NO : ${sampleDetailsForm.sr_no || "N/A"}</strong>
           <p><strong>TYPE OF SAMPLE : </strong>${sampleDetailsForm.sampleType || "N/A"}</p>
           <div style="display:flex; gap:10px;">
           <p><strong>PATTERN : </strong>${sampleDetailsForm.pattern || "N/A"}</p>
           <p><strong>SEASON : </strong>${sampleDetailsForm.season || "N/A"}</p>
           </div>
           </div>

           <div style="display: flex; flex-direction:column;  ">
           <p><strong>DATE OF ORDER: </strong>${formatDDMMYYYYDate(sampleDetailsForm.dateOfOrder) || "N/A"}</p>
           <p><strong>PROD EX-FEACT Dt : </strong>${formatDDMMYYYYDate(sampleDetailsForm.prodExDate) || "N/A"}</p>
           <p><strong>DELIVERY DATE : </strong>${formatDDMMYYYYDate(sampleDetailsForm.deliveryDate) || "N/A"}</p>
           </div>

        </div>
       
      
      </div>
      <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
      ${generateHeaders(headers)}
      <div style="border-top: 2px solid #000; margin-top: 5px;"></div>
      ${generateTable(tableRows)}
      <div style="border-top: 2px solid #000; margin-top: 5px;"></div>
       <div style="display:flex;align-items: center;  font-size: 13px;  ">
       <p><strong>UPPER : </strong>${sampleDetailsForm.upperColor || "N/A"}</p>
       <p style="margin-left:20%;"><strong>SOLE LABEL : </strong>${sampleDetailsForm.soleLabel || "N/A"}</p>
       </div>
       <div style="display:flex;  justify-content: space-between; align-items: center;  font-size: 13px; ">
       <p><strong>LINING : </strong>${sampleDetailsForm.liningColor || "N/A"}</p>
       <p><strong>SOCK : </strong>${sampleDetailsForm.socks || "N/A"}</p>
       <strong style="word-wrap: break-word;width:300px; font-size: 16px;">${sampleDetailsForm.leather_remark|| "N/A"}</strong>
       </div>
       <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
      <div style="display: flex; margin-top: 2px;">
      <div style="display: flex;flex-direction:column;width:60%;">
        <div style="display: flex; gap:20px;  font-size: 13px; ">
        <p><strong>Buyer Upper Color : </strong>${sampleDetailsForm.upperColor || "N/A"}</p>
        <p><strong>Buyer Lining Color : </strong>${sampleDetailsForm.liningColor || "N/A"}</p>
        </div>
        <div style="margin-top:20px;">
        <strong style="font-size: 18px; word-wrap: break-word; margin-right:30px">${sampleDetailsForm.comments || "N/A"}</strong>
        </div>
        </div>
        <div style="width:40%; display: flex; margin-top:20px; justify-content: end;">
        <div style="border: 2px solid black; padding: 2px; display: inline-flex;">
        <img src="${qrCodeSrc}" alt="QR Code" style="width: 150px; height: 150px" />
    </div>
    <div style="border: 2px solid black; padding: 2px; display: inline-flex; margin-left: 10px;">
        <img src="${imageSrc}" alt="Sample Image" style="width: 150px; height: 150px" />
    </div>
    </div>
   
      </div>
      <div style="border-top: 2px solid #000; margin-top: 10px;"></div>
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
  
      </div>
   
        
`;

  const canvas = await html2canvas(invoiceElement, {
    windowWidth: invoiceElement.scrollWidth,
    windowHeight: invoiceElement.scrollHeight,
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });
  pdf.addImage(imgData, "PNG", 0, 0, 297, 210);

  const pdfBlob = pdf.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");

  document.body.removeChild(invoiceElement);
};
