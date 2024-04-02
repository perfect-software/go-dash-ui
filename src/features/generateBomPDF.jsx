import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DefaultShoesImage from "../assets/notFound.png";
import QRCode from "qrcode";

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
  console.log(bomData);
  const now = new Date();
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const verticalTableHTML = `
  <table style="width:100%; height:100%;border: 1px solid black;">
  <tr>
    <th style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle; border-right: 1px solid black; padding: 5px;">Size</th>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">22</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">33</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">23</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">29</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">20</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">24</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">28</td>

  </tr>
  <tr>
    <th style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle; border-right: 1px solid black; padding: 5px;">Extra</th>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">456</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">33</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">23</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">29</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">20</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">24</td>
    <td style="border-bottom: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle;padding: 5px;  border-right: 1px solid black;">28</td>
  </tr>
  <tr>
    <th style="border-right: 1px solid black; font-size: 10px; text-align: center; vertical-align: middle; padding: 5px;">Qty</th>
    <td style="padding: 5px;font-size: 10px; text-align: center; vertical-align: middle; border-right: 1px solid black;">45</td>
    <td style=" font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">33</td>
    <td style=" font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">23</td>
    <td style=" font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">29</td>
    <td style=" font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">20</td>
    <td style=" font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">24</td>
    <td style=" font-size: 10px; text-align: center; vertical-align: middle;padding: 5px; border-right: 1px solid black;">28</td>
  </tr>
</table>
`;

  const currentDate = now.toLocaleDateString("en-GB", dateOptions);
  const currentTime = now.toLocaleTimeString("en-GB", timeOptions);
  const groupsRows = bomData.groups.map((group) => {
    return `
      <div style="margin-bottom: 5px; width: 100%;">
        <div style="font-size: 20px; font-weight: bold; margin-bottom: 3px;">
          ${group.name}
        </div>
        ${group.subgroups.map((subgroup) => {
          return `
            <div style="border-left: 1px solid #E5E7EB; padding: 4px; margin-bottom: 3px;">
              <div style="font-size: 20px; margin-bottom: 3px;">${subgroup.name}</div>
              ${subgroup.items.map((item) => {
                return `
                  <div style="display: flex; font-size: 20px; width: 100%; gap: 10px;">
                    <div style="padding: 4px; width: 60%;">${item.itemName || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.usedIn || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.From || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.to || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.unit || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.pair || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.bomQty || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.requiredQty || "N/A"}</div>
                    <div style="padding: 4px; width: 6%;">${item.poNo || "N/A"}</div>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }).join("");

  const invoiceElement = document.createElement("div");
  invoiceElement.style.position = "absolute";
  invoiceElement.style.left = "-9999px";
  invoiceElement.style.width = "210mm"; // Changed width to A4 portrait width
  invoiceElement.style.height = "297mm"; // Changed height to A4 portrait height
  document.body.appendChild(invoiceElement);

  invoiceElement.innerHTML = `

  <div style="display: flex; flex-direction: column; padding:8px;  color: #000;">
    <div style="display: flex; justify-content: space-between;">
      <strong style="font-size: 12px;">GUPTA H.C. OVERSEAS (I) PVT. LTD</strong>
   
      <h2 style="font-size: 10px;">Date : ${currentDate}</h2>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top:4px">
       <h2 style="font-size: 10px;">BOM</h2>
       <strong style="font-size: 10px;">WORK ORDER 19392/40</strong>
      <h2 style="font-size: 10px;">Time : ${currentTime}</h2>
    </div>
    <div style="border-top: 1px solid black; margin-top: 10px;"></div>
    <div style="display: flex; gap:10px;">
    <div style="width: 40%;">
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Buyer:</strong> ${bomData.buyerName || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Article:</strong> ${bomData.articleNo || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Color</strong> ${bomData.color || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Buyer Style No.</strong> ${bomData.styleNo || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Order Date</strong> ${bomData.styleNo || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Order No</strong> ${bomData.styleNo || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Order Qty.</strong> ${bomData.styleNo || "Not Available"}
      </p>
    </div>
    <div style="width: 40%;">
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Extra</strong> ${bomData.extra || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Buyer Group</strong> ${bomData.buyerGroup || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Last</strong> ${bomData.last || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Ex-Fact</strong> ${bomData.exFact || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Ex-India</strong> ${bomData.exIndia || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Socks Priting</strong> ${bomData.socks || "Not Available"}
      </p>
      <p style="color: #000; font-size: 11px; word-wrap: break-word; margin: 0;">
        <strong>Branding</strong> ${bomData.branding || "Not Available"}
      </p>
    </div>
    <div style="width: 20%; margin-bottom:20px; display: flex; justify-content: flex-end;">
    <img src="${DefaultShoesImage}" alt="Shoes Image" style="width: 140px; height:140px;" />
  </div>
      </div>
      <div style="border-top: 1px solid black; margin-top: 10px;"></div>
      <div style="width: 100%; display:flex; gap:10px">
      <p style="color: #000;width: 55%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Material with Specification
      </p>
      <p style="color: #000;width: 8%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Used In
      </p>
      <p style="color: #000;width: 12%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Size Range
      </p>
  
      <p style="color: #000;width: 6%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Unit
      </p>
      <p style="color: #000;width: 6%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Pair
      </p>
      <p style="color: #000;width: 8%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Bom Qty
      </p>
      <p style="color: #000;width: 8%; font-size: 11px; word-wrap: break-word; margin: 0;">
      Req. Qty
      </p>
      <p style="color: #000;width: 6%; font-size: 11px; word-wrap: break-word; margin: 0;">
      PO.NO
      </p>
    </div>

      <strong style="margin-top: 5px; display: block; margin-left: auto; margin-right: auto;font-size: 10px;">WORK ORDER 1405/453</strong>
  <div style="margin-top: 10px;">${verticalTableHTML} </div>
 
  <div style="width: 210mm; height: 297mm; padding: 20px; font-family: Arial, sans-serif;">
  ${groupsRows}
</div>
    <div style="display: flex; height: fit-content;  vertical-align: middle; text-align: center; width: 100%; padding: 2px; background-color: white; justify-content: end; align-items: center;">
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
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

const imgHeight = (canvas.height * 210) / canvas.width;
let position = 0;
let remainingHeight = imgHeight;

while (remainingHeight > 0) {
    if (position !== 0) {
        pdf.addPage();
    }
    const pageHeight = Math.min(remainingHeight, 297);
    pdf.addImage(imgData, "PNG", 0, position, 210, pageHeight);

    remainingHeight -= pageHeight;
    position -= 297;

    if (remainingHeight > 0) {
        pdf.addPage(); // Add a new page if there's more content remaining
    }
}

const pdfBlob = pdf.output("blob");
const pdfUrl = URL.createObjectURL(pdfBlob);
window.open(pdfUrl, "_blank");

document.body.removeChild(invoiceElement);
};

const InvoiceComponent = () => null;

export default InvoiceComponent;
