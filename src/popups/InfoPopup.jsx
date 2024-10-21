import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import styles from "../styles/infoPopup.module.css";
import Cross from "../assets/cross.svg";

const InfoPopup = ({ onCancel, infoName }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  const tableData = {
    sampleDetailsInfo: [
      {
        field: "Copy From",
        description: "Copy from already existing Sample Request",
        type: "Text",
        fieldFormat: "Read only (auto-insert)",
        source: "",
      },
      {
        field: "Season",
        description:
          "Select the season for which the Sample Request is created",
        type: "Dropdown",
        fieldFormat: "",
        source: "Season Master",
      },
      {
        field: "Date of Order",
        description: "This is the Date on which the Sample Order is received",
        type: "Current Date",
        fieldFormat: "Read only",
        source: "",
      },
      {
        field: "Sample Ref.",
        description: "Unique Reference Identification for Sample Request",
        type: "Text",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Buyer Name",
        description:
          "Name of the Buyer requesting the Sample (Only Sundry Debtors will be Displayed)",
        type: "Dropdown",
        fieldFormat: "",
        source: "Account Master",
      },
      {
        field: "Type of Sample",
        description: "Categorization of the Sample based on its purpose",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Insert Image",
        description: "Attach the Article image",
        type: "Image",
        fieldFormat: "JPEG or PNG",
        source: "",
      },
      {
        field: "Article Name",
        description:
          "The designated name of the Article for factory internal purposes",
        type: "Text",
        fieldFormat: "",
        source: "Article Master",
      },
      {
        field: "Buyer Article",
        description: "Article Number assigned by the Buyer",
        type: "Text",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Buyer Ref.",
        description: "Buyer Reference assigned by the Buyer",
        type: "Text",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Size",
        description: "Specified Size for Sample Development",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Quantity",
        description: "Number of Pair Required by the Buyer",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Own Quantity",
        description: "Number of Pair Required for our internal purposes",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Pair",
        description:
          "Indicates which pair is required (Left Size, Right Size, Both)",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
    ],

    purchaseOrderInfo: [
      {
        field: "PO.No.",
        description: "Auto Generated",
        type: "Read only",
        fieldFormat: "Text",
        source: "",
      },
      {
        field: "PO Date",
        description: "Purchase Order Generated Date",
        type: "Current Date",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Supplier Name",
        description:
          "Name of the Supplier (Only Sundry Creditors will be Displayed.)",
        type: "Dropdown",
        fieldFormat: "",
        source: "Account Master",
      },
      {
        field: "Delivered At",
        description: "Our Unit Name",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Type",
        description: "Select Domestic / International",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Doc Type",
        description: "Like Sole / InSole/ Leather / Material",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Buyer Name",
        description:
          "Name of the Buyer (Only Sundry Debitors will be Displayed.)",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Season",
        description:
          "Select the season for which the WorkOrder will be Displayed",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Work Order",
        description: "Work Order Displayed according to Buyer",
        type: "Dropdown",
        fieldFormat: "",
        source: "Buyer Order",
      },
      {
        field: "Item Name",
        description: "Select the Item",
        type: "Dropdown",
        fieldFormat: "",
        source: "Item Master",
      },
      {
        field: "Multiple Remarks",
        description: "Optional field, enter remark if required",
        type: "Text",
        fieldFormat: "Max 250 Char for each Remark",
        source: "",
      },
      {
        field: "Item Unit",
        description:
          "Measurement of item (e.g. INCH, SQDM, LTR, SQFT, MTR etc)",
        type: "Read only",
        fieldFormat: "Text",
        source: "Item Master",
      },
      {
        field: "Required Qty",
        description: "like 2000 MTR",
        type: "Read only",
        fieldFormat: "",
        source: "Buyer Order",
      },
      {
        field: "Extra % Required",
        description: "5%",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Store Qty",
        description: "Qty Entered by Concerned Store",
        type: "Read only",
        fieldFormat: "",
        source: "Item Group Master",
      },
      {
        field: "Qty",
        description:
          "Actual PO Qty ((Required Qty + Extra % Required) - Store Qty = PO Qty)",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Rate",
        description: "Rate",
        type: "Number",
        fieldFormat: "",
        source: "Quotation",
      },
      {
        field: "Remark for Each Item",
        description: "Optional field, enter remark if required",
        type: "Text",
        fieldFormat: "Max 250 Char",
        source: "",
      },
      {
        field: "Payment Terms",
        description: "Optional field, enter Payment Terms if required",
        type: "Dropdown",
        fieldFormat: "Max 100 Char",
        source: "Payment Terms Master",
      },
      {
        field: "Add Size",
        description: "",
        type: "Button",
        fieldFormat: "Button",
        source: "",
      },
      {
        field: "Fill Delivery Date",
        description:
          "Change Date in Top of Grid Item, After Submit This Date will Replace in Entire Grid Data",
        type: "Button",
        fieldFormat: "Button",
        source: "",
      },
      {
        field: "Fill Item Rate",
        description:
          "Change Rate in Top of Grid Item, After Submit This Rate will Replace in Entire Grid Data",
        type: "Button",
        fieldFormat: "Button",
        source: "",
      },
      {
        field: "Simulate",
        description:
          "Displayed Total Purchase Order Summary For Checking Purpose",
        type: "Button",
        fieldFormat: "Button",
        source: "",
      },
    ],
    DMTRInfo: [
      // Item Details Section
      {
        field: "DATE",
        description: "Goods received date",
        type: "Read only",
        fieldFormat: "Current Date",
        source: "",
      },
      {
        field: "Supplier Name",
        description:
          "Name of the Supplier (Only Sundry Creditors will be Displayed.)",
        type: "Dropdown",
        fieldFormat: "Max 16 Char",
        source: "Account Master",
      },
      {
        field: "Invoice Date",
        description: "Mentioned in Supplier Invoice (Supplier Invoice Date)",
        type: "Date",
        fieldFormat: "dd/mm/yyyy",
        source: "",
      },
      {
        field: "Invoice No.",
        description: "Supplier Invoice No",
        type: "Text",
        fieldFormat: "Max 16 Char",
        source: "",
      },
      {
        field: "Billty No.",
        description: "Mentioned in Supplier Invoice",
        type: "Text",
        fieldFormat: "Max 16 Char",
        source: "",
      },
      {
        field: "Gate Entry",
        description: "Gate Serial No. provided by our Gate person",
        type: "Text",
        fieldFormat: "Max 12 Char",
        source: "",
      },
      {
        field: "E-WAY Bill No.",
        description: "Mentioned in Supplier Invoice",
        type: "Text",
        fieldFormat: "",
        source: "",
      },

      { field: "Item Details", type: "Heading", description: "TAB" },

      {
        field: "PO Type",
        description: "Select [Production] / [Sample] / [Other]",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "DOC Type",
        description: "Select Leather / Material / Packing",
        type: "Dropdown",
        fieldFormat: "",
        source: "",
      },
      {
        field: "PO No.",
        description:
          "Fill PO number from combo of 3 drop-downs [Supplier Name, PO Type, DOC TYPE] in this sequence and PO Should be Approved",
        type: "Dropdown",
        fieldFormat: "",
        source: "Purchase Order",
      },
      {
        field: "ITEM NAME",
        description:
          "Item will be Filled from Purchase Order. (Only Balance Item will be Displayed.)",
        type: "Dropdown",
        fieldFormat: "",
        source: "Purchase Order",
      },
      {
        field: "ITEM Unit",
        description:
          "Measurement of Item (e.g. INCH, SQM, LTR, SQFT, MTR etc.)",
        type: "Read only",
        fieldFormat: "",
        source: "Item Master",
      },
      {
        field: "HSN Code",
        description: "Mentioned in Supplier Invoice",
        type: "Text",
        fieldFormat: "",
        source: "",
      },

      {
        field: "PO QTY (Balance)",
        description: "Balance Purchase Order Qty of an Item",
        type: "Read only",
        fieldFormat: "",
        source: "Purchase Order",
      },
      {
        field: "EXTRA %",
        description: "More % to be Received from Purchase Order Qty",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Rate",
        description: "Mentioned in Supplier Invoice",
        type: "Number",
        fieldFormat: "",
        source: "Supplier Invoice",
      },
      {
        field: "QTY",
        description: "Receive Quantity of item",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "QTY (SQFT)",
        description:
          "Quantity of item; Mandatory only in case if item = Leather",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "Rate (SQFT)",
        description: "Rate of item; Mandatory only in case if item = Leather",
        type: "Number",
        fieldFormat: "",
        source: "",
      },
      {
        field: "PIECES",
        description: "Defines number of Packets / Bundles",
        type: "Number",
        fieldFormat: "",
        source: "",
      },

      {
        field: "IGST %",
        description:
          "Mandatory only in case of Supplier is from other State or Supplier have GST.NO.",
        type: "Number",
        fieldFormat: "XX.XX",
        source: "",
      },
      {
        field: "CGST %",
        description:
          "Mandatory only in case of Supplier is from own State or Supplier have GST.NO.",
        type: "Number",
        fieldFormat: "XX.XX",
        source: "",
      },
      {
        field: "SGST %",
        description:
          "Mandatory only in case of Supplier is from own State or Supplier have GST.NO.",
        type: "Number",
        fieldFormat: "XX.XX",
        source: "",
      },
      {
        field: "ITEM REMARK",
        description: "Optional field, enter remark if required",
        type: "Text",
        fieldFormat: "Max 250 Char",
        source: "",
      },

      // Buttons and Additional Data
      {
        field: "ADD SIZE",
        description: "Breakup of sizes for selected item",
        type: "Button",
        fieldFormat: "",
        source: "",
      },
      {
        field: "ADD WORK ORDER",
        description: "Work Order displayed from selected Purchase Order",
        type: "Button",
        fieldFormat: "",
        source: "",
      },
      {
        field: "ADD ENTRY",
        description: "Current entered data will move in Grid [Temporary Table]",
        type: "Button",
        fieldFormat: "",
        source: "",
      },
      {
        field: "On Submit Add Entry",
        description:
          "Sum of ADD SIZE QTY = ITEM QTY , Sum of ADD WORK ORDER QTY = ITEM QTY , Item Rate = Purchase Order Item Rate",
        type: "Button",
        fieldFormat: "",
        source: "",
      },

      { field: "Supplier Details", type: "Heading", description: "TAB" },

      {
        field: "Supplier Details",
        description: "Display All Necessary Information of Supplier",
        type: "Tab",
        fieldFormat: "",
        source: "",
      },

      { field: "Financial Details", type: "Heading", description: "TAB" },
      {
        field: "Total Taxable Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
      {
        field: "Total IGST Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
      {
        field: "Total CGST Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
      {
        field: "Total SGST Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
      {
        field: "Total Discount Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
      {
        field: "Round Off Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
      {
        field: "Total Invoice Amount",
        description: "",
        type: "Non editable",
        fieldFormat: "Number",
        source: "",
      },
    ],
    buyerInfo: [
      { field: "Buyer Name", description: "Name of the buyer company or individual", type: "Text", fieldFormat: "", source: "" },
  { field: "Merchandiser", description: "Name of the merchandiser responsible for this buyer", type: "Text", fieldFormat: "", source: "" },
  { field: "Buyer Type", description: "Type of buyer (e.g., Retail, Wholesale)", type: "Dropdown", fieldFormat: "", source: "" },
  { field: "Contact Person", description: "Name of the contact person for the buyer", type: "Text", fieldFormat: "", source: "" },
  { field: "Phone Number", description: "Phone number of the contact person", type: "Text", fieldFormat: "", source: "" },
  { field: "Country", description: "Two-letter code of the buyer's country", type: "Dropdown", fieldFormat: "Enter two letter and select Country", source: "" },
  { field: "State", description: "Two-letter code of the buyer's state", type: "Dropdown", fieldFormat: "After selecting country enter two letter and select State", source: "" },
  { field: "City", description: "Two-letter code of the buyer's city", type: "Dropdown", fieldFormat: "After selecting State enter two letter and select City", source: "" },
  { field: "Pincode", description: "Pincode or ZIP code of the buyer's address", type: "Text", fieldFormat: "", source: "" },
  { field: "Mobile Number", description: "Mobile number of the contact person", type: "Text", fieldFormat: "", source: "" },
  { field: "Currency", description: "Currency code used by the buyer (e.g., USD, INR)", type: "Text", fieldFormat: "", source: "" },
  { field: "Billing Address", description: "Address where bills will be sent", type: "Text", fieldFormat: "", source: "" },
  { field: "Delivery Address", description: "Address where goods will be delivered", type: "Text", fieldFormat: "", source: "" },
  { field: "Email Id", description: "Email ID of the buyer or contact person", type: "Text", fieldFormat: "", source: "" },
  { field: "Abbreviation", description: "Shortened form of the buyer name for internal use", type: "Text", fieldFormat: "", source: "" },

  // Bank Details Section
  { field: "Bank Name", description: "Name of the buyer's bank", type: "Text", fieldFormat: "", source: "" },
  { field: "Bank Branch", description: "Branch of the buyer's bank", type: "Text", fieldFormat: "", source: "" },
  { field: "Bank City", description: "City where the bank branch is located", type: "Text", fieldFormat: "", source: "" },
  { field: "Bank Address", description: "Full address of the buyer's bank branch", type: "Text", fieldFormat: "", source: "" },
  { field: "A/C no", description: "Account number of the buyer in the bank", type: "Number", fieldFormat: "", source: "" },
  { field: "Confirm A/C no", description: "Field to confirm the account number entered", type: "Number", fieldFormat: "", source: "" },
  { field: "Swift Code", description: "SWIFT code of the buyer's bank for international transactions", type: "Number", fieldFormat: "", source: "" },
  { field: "IFSC Code", description: "IFSC code for bank transactions", type: "Text", fieldFormat: "", source: "" },

  // Financials Section
  { field: "Discount %", description: "Discount percentage offered to the buyer", type: "Text", fieldFormat: "", source: "" },
  { field: "SP Discount", description: "Special discount offered for specific purchases", type: "Text", fieldFormat: "", source: "" },
  { field: "Payment Terms", description: "Agreed payment terms for the buyer (e.g., 30 days)", type: "Dropdown", fieldFormat: "", source: "" },
  { field: "Comment", description: "Any additional notes or comments about the buyer", type: "TextArea", fieldFormat: "", source: "" }
    ],

    articleInfo: [
      { field: "Article No", description: "Unique identification number for the article", type: "Dropdown", fieldFormat: "Can Also Choose Clicking on Search Button", source: "" },
      { field: "Article Name", description: "Name of the shoe article", type: "Text", fieldFormat: "", source: "" },
      { field: "Last No", description: "Number of the last used in the production of the shoe", type: "Text", fieldFormat: "", source: "" },
      { field: "Last Type", description: "Type of the last used in the shoe (e.g., high, low, or medium)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Season", description: "Applicable season for the shoe", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Article Color", description: "Color of the shoe", type: "Text", fieldFormat: "", source: "" },
      { field: "Color Code", description: "Code representing the shoe color", type: "Text", fieldFormat: "", source: "" },
      { field: "Gender", description: "Gender category for the shoe (e.g., Men, Women, Unisex)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Animal", description: "Type of animal leather or material used", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Leather", description: "Type of leather used in the shoe", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Insole", description: "Type of insole used for comfort", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Sole", description: "Material of the shoe sole", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Sole Type", description: "Type of sole used in the shoe", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Toe Shape", description: "Shape of the shoe's toe (e.g., round, pointed)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Category", description: "Category of the shoe (e.g., Casual, Formal)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Sub Category", description: "Further classification within the category", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Platform No", description: "Platform number for the shoe design", type: "Text", fieldFormat: "", source: "" },
      { field: "Heel No", description: "Number assigned to the heel used in the shoe", type: "Text", fieldFormat: "", source: "" },
      { field: "Heel Height", description: "Height of the heel", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Heel Type", description: "Type of heel used (e.g., block, stiletto)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Lining Material", description: "Material used for the inner lining of the shoe", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Socks Material", description: "Material used for socks (if applicable)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Platform Type", description: "Type of platform used in the shoe", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Comment", description: "Additional notes or comments", type: "TextArea", fieldFormat: "", source: "" },
      { field: "Upload Image", description: "Upload image of the shoe article", type: "Image Upload", fieldFormat: "", source: "" }
    ],
  };

  const infoMap = {
    "Purchase Order": "purchaseOrderInfo",
    "Sample Details": "sampleDetailsInfo",
    DMTR: "DMTRInfo",
    Buyer: "buyerInfo",
    Article: "articleInfo",
  };
  const rowData = tableData[infoMap[infoName]] || [];

  const columnDefs = [
    {
      headerName: "Field Name",
      field: "field",
      cellRenderer: (params) => {
        if (params.data.type === "Heading") {
          return (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button className={styles.viewButton}>{params.value}</button>
            </div>
          );
        } else {
          return params.value;
        }
      },
    },

    {
      headerName: "Detail of Selected Field",
      field: "description",
      autoHeight: true, // Enables auto height for this column
      cellRenderer: (params) => {
        const [expanded, setExpanded] = React.useState(false);
        const maxChars = 70;
        const toggleExpanded = () => {
          setExpanded(!expanded);
          // Force AG Grid to recalculate the row height
          params.api.resetRowHeights();
        };

        return (
          <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {expanded
              ? params.value
              : params.value.slice(0, maxChars) +
                (params.value.length > maxChars ? "..." : "")}
            {params.value.length > maxChars && (
              <span
                onClick={toggleExpanded}
                style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
              >
                {expanded ? "Read Less" : "Read More"}
              </span>
            )}
          </div>
        );
      },
      width: 420, // Adjust width as necessary
    },
    {
      headerName: "Field Type",
      field: "type",
      width: 150,
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        if (params.data.type === "Heading") {
          return null; // Hide the content if it's a heading
        } else {
          return params.value; // Show the field type otherwise
        }
      },
    },
    {
      headerName: "Field Format",
      field: "fieldFormat",
      sortable: true,
      filter: true,
      autoHeight: true, // Enables auto height for this column
      cellRenderer: (params) => {
        const [expanded, setExpanded] = React.useState(false);
        const maxChars = 30;
        const toggleExpanded = () => {
          setExpanded(!expanded);
          // Force AG Grid to recalculate the row height
          params.api.resetRowHeights();
        };

        return (
          <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {expanded
              ? params.value
              : params.value.slice(0, maxChars) +
                (params.value.length > maxChars ? "..." : "")}
            {params.value.length > maxChars && (
              <span
                onClick={toggleExpanded}
                style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
              >
                {expanded ? "Read Less" : "Read More"}
              </span>
            )}
          </div>
        );
      },
      width: 240, // Adjust width as necessary
    },

    { headerName: "Source", field: "source", sortable: true, filter: true },
  ];
  const getRowStyle = (params) => {
    const rowIndex = params.node.rowIndex;

    if (rowIndex % 6 < 2) {
      return { backgroundColor: "#e8f5e9" }; // Light green
    } else if (rowIndex % 6 < 4) {
      return { backgroundColor: "#fff9c4" }; // Light yellow
    } else {
      return { backgroundColor: "#f0f0f0" }; // Light grey
    }
  };

  // const getRowStyle = (params) => {
  //   return {
  //     backgroundColor: params.node.rowIndex % 2 === 0 ? "#ffffff" : "#f5f5f5",
  //   };
  // };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.InfoPopupContainer}>
          <div className={styles.topInfoPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>{infoName} Input Information</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Close Icon"
                className={styles.crossIcon}
              />
            </div>
          </div>

          <div
            className={`ag-theme-quartz`}
            style={{ height: 600, width: "100%", marginTop: "10px" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              getRowStyle={getRowStyle}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default InfoPopup;
