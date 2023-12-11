import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import DefaultShoesImage from "../assets/notFound.png";
import QRCode from "qrcode";
import { formatDate } from "../features/convertDate";
const generateQR = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text);
    return qrCodeDataURL;
  } catch (err) {
    console.error(err);
    return "";
  }
};

export const generatePDF = async (sampleDetailsForm, imagePreview) => {
  const qrCodeBase64 = await generateQR(
    sampleDetailsForm.sampleRef || "No Reference"
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

  const tableBody = [
    [
      "Sample Type",
      sampleDetailsForm.sampleType,
      "Quantity",
      sampleDetailsForm.quantity,
    ],
    [
      "Pair",
      sampleDetailsForm.pair,
      "Upper Color",
      sampleDetailsForm.upperColor,
    ],
    [
      "Lining Color",
      sampleDetailsForm.liningColor,
      "Last",
      sampleDetailsForm.last,
    ],
    [
      "Insole",
      sampleDetailsForm.insole,
      "Sole Label",
      sampleDetailsForm.soleLabel,
    ],
    ["Socks", sampleDetailsForm.socks, "Heel", sampleDetailsForm.heel],
    [
      "Pattern",
      sampleDetailsForm.pattern,
      "Buyer Ref",
      sampleDetailsForm.buyerRef,
    ],
    [
      "In Upper Leather",
      sampleDetailsForm.inUpperLeather,
      "In Lining",
      sampleDetailsForm.inLining,
    ],
    [
      "In Socks",
      sampleDetailsForm.inSocks,
      "In Quantity",
      sampleDetailsForm.inQuantity,
    ],
  ];

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
    <h2>SAMPLE ORDER/SPECIFICATION SHEET</h2>
    <strong>${sampleDetailsForm.season || "Not Available"}</strong>
    <h2>Date : ${currentDate}</h2>
  </div>
  <div style="display: flex; justify-content: space-between; margin-top:4px">
     <strong>SCUM</strong>
     <strong style="font-size: 20px; text-decoration: underline;">PLAN NO. 19392</strong>
    <h2>Time : ${currentTime}</h2>
  </div>

  <div style="display: flex; margin-top: 10px;">
  <div style="width: 70%;">
    <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
      <strong>Buyer:</strong> ${sampleDetailsForm.bsName || "Not Available"}
    </p>
    <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
      <strong>Address:</strong> ${
        sampleDetailsForm.deliveryAddress || "Not Available"
      }
    </p>
    <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
      <strong>Article No:</strong> ${
        sampleDetailsForm.articleNo || "Not Available"
      }
    </p>
    <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
      <strong>Sample Reference No:</strong> ${
        sampleDetailsForm.sampleRef || "Not Available"
      }
    </p>
    <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
    <strong>Delivery Date:</strong> ${
      formatDate(sampleDetailsForm.deliveryDate) || "Not Available"
    }
  </p>
  <p style="color: #000; font-size: 15px; word-wrap: break-word; margin: 0;">
  <strong>ProdExDate:</strong> ${
    formatDate(sampleDetailsForm.prodExDate) || "Not Available"
  }
</p>
  </div>




  <div style="width: 30%;  margin-top:10px; margin-bottom:20px; display: flex; justify-content: flex-end;">
  <img src="${
    imagePreview || DefaultShoesImage
  }" alt="QR Code" style="width: 140px; height:140px;" />
  <img src="${qrCodeBase64}" alt="Shoes Image" style="width: 140px; height:140px;" />
</div>
    </div>
     
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; margin-top: 20px;">
    <thead>
        <tr>
          <th style="border: 1px solid #000; text-align: left; padding-block: 3px; padding-inline: 5px; ">Field</th>
          <th style="border: 1px solid #000; text-align: left; padding-block: 3px; padding-inline: 5px;">Details</th>
          <th style="border: 1px solid #000; text-align: left; padding-block: 3px; padding-inline: 5px;">Field</th>
          <th style="border: 1px solid #000; text-align: left; padding-block: 3px; padding-inline: 5px;">Details</th>
        </tr>
      </thead>
    <tbody>
    ${tableBody
      .map(
        (row) =>
          `<tr>${row
            .map(
              (cell) =>
                `<td style="border: 1px solid #000; word-wrap: break-word; text-align: left; padding-block: 3px; padding-inline: 5px; vertical-align: middle;">${cell}</td>`
            )
            .join("")}</tr>`
      )
      .join("")}
  </tbody>
  </table>
     
  <div style="width:100%">
  <p style="color: #000; font: bold 13px Arial; word-wrap: break-word; margin: 0;">
  <strong style="font: bold 13px Arial">Comment:</strong> ${
    sampleDetailsForm.comments || "Not Available"
  }
</p>
  </div>
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
