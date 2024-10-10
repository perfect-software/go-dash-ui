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
    purchaseOrderInfo: [
      { field: "PO.No.", description: "Auto Generated", type: "Read only", fieldFormat: "Text", source: "" },
      { field: "PO Date", description: "Purchase Order Generated Date", type: "Current Date", fieldFormat: "", source: "" },
      { field: "Supplier Name", description: "Name of the Supplier (Only Sundry Creditors will be Displayed.)", type: "Dropdown", fieldFormat: "", source: "Account Master" },
      { field: "Delivered At", description: "Our Unit Name", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Type", description: "Select Domestic / International", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Doc Type", description: "Like Sole / InSole/ Leather / Material", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Buyer Name", description: "Name of the Buyer (Only Sundry Debitors will be Displayed.)", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Season", description: "Select the season for which the WorkOrder will be Displayed", type: "Dropdown", fieldFormat: "", source: "" },
      { field: "Work Order", description: "Work Order Displayed according to Buyer", type: "Dropdown", fieldFormat: "", source: "Buyer Order" },
      { field: "Item Name", description: "Select the Item", type: "Dropdown", fieldFormat: "", source: "Item Master" },
      { field: "Multiple Remarks", description: "Optional field, enter remark if required", type: "Text", fieldFormat: "Max 250 Char for each Remark", source: "" },
      { field: "Item Unit", description: "Measurement of item (e.g. INCH, SQDM, LTR, SQFT, MTR etc)", type: "Read only", fieldFormat: "Text", source: "Item Master" },
      { field: "Required Qty", description: "like 2000 MTR", type: "Read only", fieldFormat: "", source: "Buyer Order" },
      { field: "Extra % Required", description: "5%", type: "Number", fieldFormat: "", source: "" },
      { field: "Store Qty", description: "Qty Entered by Concerned Store", type: "Read only", fieldFormat: "", source: "Item Group Master" },
      { field: "Qty", description: "Actual PO Qty ((Required Qty + Extra % Required) - Store Qty = PO Qty)", type: "Number", fieldFormat: "", source: "" },
      { field: "Rate", description: "Rate", type: "Number", fieldFormat: "", source: "Quotation" },
      { field: "Remark for Each Item", description: "Optional field, enter remark if required", type: "Text", fieldFormat: "Max 250 Char", source: "" },
      { field: "Payment Terms", description: "Optional field, enter Payment Terms if required", type: "Dropdown", fieldFormat: "Max 100 Char", source: "Payment Terms Master" },
      { field: "Add Size", description: "", type: "Button", fieldFormat: "Button", source: "" },
      { field: "Fill Delivery Date", description: "Change Date in Top of Grid Item, After Submit This Date will Replace in Entire Grid Data", type: "Button", fieldFormat: "Button", source: "" },
      { field: "Fill Item Rate", description: "Change Rate in Top of Grid Item, After Submit This Rate will Replace in Entire Grid Data", type: "Button", fieldFormat: "Button", source: "" },
      { field: "Simulate", description: "Displayed Total Purchase Order Summary For Checking Purpose", type: "Button", fieldFormat: "Button", source: "" },
    ],
  };

  const infoMap = {
    "Purchase Order": "purchaseOrderInfo",
    "Sales Order": "salesOrderInfo",

  };
  const rowData = tableData[infoMap[infoName]] || [];

 
  const columnDefs = [
    { headerName: "Field Name", field: "field", sortable: true, filter: true },
    { headerName: "Detail of Selected Field", field: "description", width: 450, sortable: true, filter: true },
    { headerName: "Field Format", field: "fieldFormat", sortable: true, filter: true },
    { headerName: "Field Type", field: "type", width: 150, sortable: true, filter: true },
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
            style={{ height: 600, width: "100%" , marginTop:"10px"}}
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
