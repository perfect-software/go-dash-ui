import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DefaultShoesImage from "../assets/notFound.png";
import QRCode from "qrcode";
import { formatDate } from "./convertDate";

const generateQR = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text);
    return qrCodeDataURL;
  } catch (err) {
    console.error(err);
    return "";
  }
};

export const generatePDF = async (articleCostForm) => {
  console.log(articleCostForm.articleNo);
  const qrCodeBase64 = await generateQR(
    articleCostForm.buyerName || "No Reference"
  );



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

  const itemsRows = articleCostForm.items.map(item => 
    `<tr>
      <td style="border: 1px solid #000;font-size: 15px;  text-align: center; padding: 8px; background-color: #f0f0f0;">${item.itemName || 'N/A'}</td>
      <td style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">${item.quantity || 'N/A'}</td>
      <td style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">${item.rate || 'N/A'}</td>
      <td style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">${item.cost || 'N/A'}</td>
    </tr>`
  ).join('');
  
  const invoiceElement = document.createElement("div");
  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.width = "297mm";
  invoiceElement.style.height = "210mm";
  document.body.appendChild(invoiceElement);

  invoiceElement.innerHTML = `
  <div style="display: flex; flex-direction: column; padding:14px;  color: #000;">
    <div style="display: flex; justify-content: space-between;">
      <h2>GUPTA H.C. OVERSEAS (I) PVT. LTD</h2>
      <h2 style="margin-right:130px;">Article Costing</h2>
      <h2>Date : ${currentDate}</h2>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top:4px">
       <strong>Article</strong>
       <strong style="font-size: 20px; text-decoration: underline;">PLAN NO. 19392</strong>
      <h2>Time : ${currentTime}</h2>
    </div>
  
    <div style="display: flex; margin-top: 5px;">
    <div style="width: 70%;">
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Buyer:</strong> ${articleCostForm.buyerName || "Not Available"}
      </p>
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Article No:</strong> ${articleCostForm.articleNo || "Not Available"}
      </p>
    </div>

    <div style="width: 30%; margin-bottom:20px; display: flex; justify-content: flex-end;">
    <img src="${qrCodeBase64}" alt="Shoes Image" style="width: 140px; height:140px;" />
  </div>
      </div>
       
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Item Name</th>
        <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Quantity</th>
        <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Rate</th>
        <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Cost</th>
      </tr>
      ${itemsRows}  
      <tr>
        <td colspan="3" style="border: 1px solid #000; text-align: right; padding: 8px;">Total Cost:</td>
        <td style="border: 1px solid #000; text-align: center; padding: 8px;">${articleCostForm.totalCost}</td>
      </tr>
    </table>
      <div style="display: flex; justify-content: space-between; margin-top:30px">
        <div style="text-align: left;">
          <p style="color: #000;">Seller Signature</p>
          <div style="width: 180px; height: 40px; border: 1px solid #000; margin-top: 15px;"></div>
        </div>
        <div style="text-align: right;">
          <p style="color: #000;">Merchandiser Signature</p>
          <div style="width: 180px; height: 40px; border: 1px solid #000; margin-top: 15px;"></div>
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

const InvoiceComponent = () => null;

export default InvoiceComponent;
