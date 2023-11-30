import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Logo from "../assets/logo.png";
import NotFound from "../assets/notFound.png";
import QRCode from "qrcode";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const convertImageToBase64 = (imgUrl) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", imgUrl);
    xhr.responseType = "blob";
    xhr.send();
  });
};

const generateQR = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text);
    return qrCodeDataURL;
  } catch (err) {
    console.error(err);
    return "";
  }
};

const generatePDF = async (sampleDetailsForm, imageUrl) => {
  const logoBase64 = await convertImageToBase64(Logo);
  const shoesImageBase64 = await convertImageToBase64(imageUrl || NotFound);

  const qrCodeBase64 = await generateQR(sampleDetailsForm.sampleRef || 'No Refrence');

  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape",
    content: [
      {
        columns: [
          {
            image: logoBase64,
            width: 80,
          },
          {
            text: " GUPTA H.C. OVERSEAS (I) PVT. LTD",
            style: "header",
            alignment: "middle",
            margin: [0, 27, 0, 0],
          },
          {
            text: "Inovice",
            style: "subHeader",
            alignment: "right",
            margin: [0, 5, 0, 0],
          },
        ],
        columnGap: 10,
      },
      {
        columns: [
          {
            width: "*",
            stack: [
              { text: `BS Name: ${sampleDetailsForm.bsName}`, style: "info" },
              {
                text: `Address: ${sampleDetailsForm.deliveryAddress}`,
                style: "info",
              },
              {
                text: `Article No: ${sampleDetailsForm.articleNo}`,
                style: "info",
              },
              {
                text: `Sample Refrence No: ${sampleDetailsForm.sampleRef}`,
                style: "info",
              },
            ],
          },
          {
          
            width: 100,
            image: qrCodeBase64,
            margin: [0, 5, 0, 5],
          },
          {
            
            height:100,
            width: 100,
            image: shoesImageBase64,
            margin: [0, 5, 0, 5],
          },
        ],
      },
      {
        style: "detailsTable",
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body: [
            ["Field", "Details", "Field", "Details"],
            [
              "Season",
              sampleDetailsForm.season,
              "Sample Type",
              sampleDetailsForm.sampleType,
            ],
            [
              "Size",
              sampleDetailsForm.size,
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
            [
              "Comments",
              sampleDetailsForm.comments,
              "Delivery Date",
              sampleDetailsForm.deliveryDate,
            ],
            ["Production Expiry Date", sampleDetailsForm.prodExDate, "", ""],
          ],
        },
        layout: "headerLineOnly",
      },
      // Signature boxes at the bottom
      {
        margin: [0, 10, 0, 0], // Add space before the signatures
        columns: [
          {
            width: "50%",
            stack: [
              {
                text: "Seller Signature",
                style: "signatureLabel",
              },
              {
                canvas: [
                  {
                    type: "rect",
                    x: 0,
                    y: 5,
                    w: 180,
                    h: 40,
                    lineWidth: 1,
                    lineColor: "#000",
                  },
                ],
              },
            ],
          },
          {
            width: "50%",
            stack: [
              {
                text: "Merchandiser Signature",
                style: "signatureLabel",
                alignment: "right",
              },
              {
                canvas: [
                  {
                    type: "rect",
                    x: 200, // Align to right edge of column
                    y: 5,
                    w: 180, // Match width of the left signature box
                    h: 40,
                    lineWidth: 1,
                    lineColor: "#000",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
      },
      subHeader: {
        fontSize: 10,
        italics: true,
      },
      info: {
        margin: [0, 2, 0, 10],
        fontSize: 10,
      },
      detailsTable: {
        fontSize: 9,
      },
      signatureLabel: {
        fontSize: 11,
        bold: true,
        margin: [0, 5],
      },
    },
  };

  pdfMake.createPdf(docDefinition).open();
};

export default generatePDF;
