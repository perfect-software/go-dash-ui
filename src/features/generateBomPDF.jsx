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

export const generatePDF = async (bomData) => {
  const qrCodeBase64 = await generateQR(bomData.buyerName || "No Reference");

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

  const groupsRows = bomData.groups
    .map((group) => {

      const groupRowSpan = group.subgroups.reduce(
        (total, subgroup) => total + subgroup.items.length,
        0
      );

      return group.subgroups
        .map((subgroup, subgroupIndex) => {
          const subgroupRowSpan = subgroup.items.length;

          return subgroup.items
            .map((item, itemIndex) => {
              const groupCell =
                subgroupIndex === 0 && itemIndex === 0
                  ? `<td rowspan="${groupRowSpan}" style="border: 1px solid #E5E7EB; font-size: 13px; text-align: center; padding: 8px;">${group.itemgrp}</td>`
                  : "";
              const subgroupCell =
                itemIndex === 0
                  ? `<td rowspan="${subgroupRowSpan}" style="border: 1px solid #E5E7EB; font-size: 13px; text-align: center; padding: 8px;">${subgroup.itemsubgrp}</td>`
                  : "";
              return `<tr>
          ${groupCell}
          ${subgroupCell}
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.itemName}</td>
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.usedIn}</td>
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.pair}</td>
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.bomQty}</td>
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.requiredQty}</td>
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.rate}</td>
          <td style="border:1px solid #E5E7EB; text-align: center; font-size: 13px; padding: 4px;">${item.cost}</td> 
        </tr>`;
            })
            .join("");
        })
        .join("");
    })
    .join("");

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
      <h2 style="margin-right:130px;">BOM</h2>
      <h2>Date : ${currentDate}</h2>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top:4px">
       <strong>BOM</strong>
       <strong style="font-size: 20px; text-decoration: underline;">PLAN NO. 19392</strong>
      <h2>Time : ${currentTime}</h2>
    </div>
  
    <div style="display: flex; margin-top: 5px;">
    <div style="width: 70%;">
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Buyer:</strong> ${bomData.buyerName || "Not Available"}
      </p>
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Article No:</strong> ${bomData.articleNo || "Not Available"}
      </p>
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Article Name</strong> ${bomData.articleName || "Not Available"}
      </p>
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Sample No:</strong> ${bomData.sampleNo || "Not Available"}
      </p>
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Color</strong> ${bomData.color || "Not Available"}
      </p>
      <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
        <strong>Animal</strong> ${bomData.animal|| "Not Available"}
      </p>
    </div>

    <div style="width: 30%; margin-bottom:20px; display: flex; justify-content: flex-end;">
    <img src="${qrCodeBase64}" alt="Shoes Image" style="width: 140px; height:140px;" />
  </div>
      </div>
       
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
      <tr>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Group</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Subgroup</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Item Name</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Used In</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Pair</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">BOM Qty</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Required Qty</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Rate</th>
     <th  style="border: 1px solid #E5E7EB; text-align: center; padding: 4px; font-size: 13px; background-color: #f0f0f0;">Cost</th>
        
      </tr>
      </thead>
      <tbody>${groupsRows}</tbody>
  
    </table>
    <div style="display: flex; height: fit-content;  vertical-align: middle; text-align: center; width: 100%; padding: 2px; background-color: #f0f0f0; justify-content: end; align-items: center;">
      <strong> Total : ${bomData.totalCost}</strong>
    </div>
      <div style="display: flex; justify-content: space-between; margin-top:30px">
        <div style="text-align: left;">
          <p style="color: #000;">Seller Signature</p>
          <div style="width: 180px; height: 40px; border: 1px solid #E5E7EB; margin-top: 15px;"></div>
        </div>
        <div style="text-align: right;">
          <p style="color: #000;">Merchandiser Signature</p>
          <div style="width: 180px; height: 40px; border: 1px solid #E5E7EB; margin-top: 15px;"></div>
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
