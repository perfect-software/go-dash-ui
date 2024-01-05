import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "../features/convertDate";

export const generatePDF = async (buyerData) => {
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

  const generateTable = (data) => {
    let tableHTML = `<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; margin-top: 20px;">
      <thead>
        <tr>
          <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Field</th>
          <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Details</th>
          <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Field</th>
          <th style="border: 1px solid #000; text-align: center; padding: 8px; background-color: #f0f0f0;">Details</th>
        </tr>
      </thead>
      <tbody>`;

    data.forEach((row) => {
      tableHTML += `<tr>`;
      row.forEach((cell) => {
        tableHTML += `<td style="border: 1px solid #000; text-align: center; padding: 8px;">${cell}</td>`;
      });
      tableHTML += `</tr>`;
    });

    tableHTML += `</tbody></table>`;
    return tableHTML;
  };

  const tableElements = buyerData.map((data, index) => `
    <div key=${index}>
      <h2>Buyer ${index + 1}</h2>
      ${generateTable([
        ["Name", data.bsName || 'N/A', "Id", data.bs_id || 'N/A'],
        ["City", data.city || 'N/A', "Pincode", data.pincode || 'N/A'],
        //  continue 
      ])}
    </div>
  `).join('');

  const commentSection = `
    <div style="width:100%">
      <p style="color: #000; font: bold 13px Arial; word-wrap: break-word; margin: 0;">
        <strong style="font: bold 13px Arial">Comment:</strong> ${buyerData.comments || "Not Available"}
      </p>
    </div>
  `;

  const invoiceElement = document.createElement("div");
  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.width = "297mm";
  invoiceElement.style.height = "210mm";
  document.body.appendChild(invoiceElement);

  invoiceElement.innerHTML = `
    <div style="display: flex; flex-direction: column; padding:14px; color: #000;">
      <div style="display: flex; justify-content: space-between;">
        <h2>GUPTA H.C. OVERSEAS (I) PVT. LTD</h2>
        <h2>SAMPLE ORDER/SPECIFICATION SHEET</h2>
        <strong>${buyerData[0]?.season || "Not Available"}</strong>
        <h2>Date : ${currentDate}</h2>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top:4px">
        <strong>SCUM</strong>
        <strong style="font-size: 20px; text-decoration: underline;">PLAN NO. 19392</strong>
        <h2>Time : ${currentTime}</h2>
      </div>

      ${tableElements}
  

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
