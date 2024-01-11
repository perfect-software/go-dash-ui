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
  const tableName = infoName.toLowerCase().replace(/\s/g, "");

  const tableData = {
    [`${tableName}Info`]: [
      {
        field: "Copy From",
        description: "Copy already existing Sample Request.",
        example: "Auto insert values in input fields",
        type: "Search",
      },

      {
        field: "Season",
        description: "Defines the season for which the sample is requested.",
        example: "SS for Spring-Summer, AW for Autumn-Winter",
        type: "Dropdown",
      },
      {
        field: "Sample Ref.",
        description: "Unique reference identifier for the sample.",
        example: "SR-2024-SS-001",
        type: "Text",
      },
      {
        field: "Buyer Name",
        description: "Name of the individual or entity requesting the sample.",
        example: "H&M",
        type: "Dropdown with Search",
      },
      {
        field: "Type of Sample",
        description:
          "Categorization of the sample based on its purpose or characteristics.",
        example: "GRADING",
        type: "Dropdown",
      },
      {
        field: "Insert Image",
        description: "Option to attach an image representing the sample.",
        example: "Upload a JPEG or PNG image.",
        type: "File Upload",
      },
      {
        field: "Article Name",
        description: "The designated name of the article for identification.",
        example: "kappa",
        type: "Searchable Text",
      },
      {
        field: "Buyer Article",
        description: "Article number or identifier provided by the buyer.",
        example: "100234B",
        type: "Text",
      },
      {
        field: "Buyer Ref.",
        description: "Reference number or code assigned by the buyer.",
        example: "BR-2024-SS-045",
        type: "Text",
      },
      {
        field: "Date of Order",
        description: "The date on which the sample order is placed.",
        example: "Automatically populated with the current date.",
        type: "Date",
      },
      {
        field: "Size",
        description: "Size specification of the sample.",
        example: "42 EU, 9 US",
        type: "Text",
      },
      {
        field: "Quantity",
        description: "Number of samples requested.",
        example: "5",
        type: "Numeric",
      },
      {
        field: "Pair",
        description: "Indicates if the sample is for the left or right.",
        example: "Left, Right",
        type: "Dropdown",
      },
      {
        field: "Upper Color",
        description: "Color specification for the upper part of the sample.",
        example: "Black, Tan",
        type: "Dropdown with Suggestions",
      },
      {
        field: "Lining Color",
        description: "Color specification for the sample's lining.",
        example: "Beige, Grey",
        type: "Dropdown with Suggestions",
      },
      {
        field: "Last",
        description: "The last used in the sample's manufacturing process.",
        example: "101, 102",
        type: "Text",
      },
      {
        field: "Insole",
        description: "Material or type of the insole in the sample.",
        example: "Padded, Orthopedic",
        type: "Text",
      },
      {
        field: "Sole Label & Color",
        description: "Labeling and color details for the sole.",
        example: "Vibram, Red",
        type: "Dropdown with Suggestions",
      },
      {
        field: "Socks",
        description:
          "Specifications or type of socks included with the sample.",
        example: "Cotton, Nylon",
        type: "Text",
      },
      {
        field: "Heel",
        description: "Details about the heel of the sample.",
        example: "2 inches",
        type: "Text",
      },
      {
        field: "Pattern",
        description: "Pattern design associated with the sample.",
        example: "Striped, Floral",
        type: "Text",
      },
      {
        field: "Upper Leather",
        description: "Details regarding the leather used in the upper part.",
        example: "Full Grain, Patent",
        type: "Text",
      },
      {
        field: "Lining",
        description: "The type of lining material used in the sample.",
        example: "Leather, Textile",
        type: "Text",
      },
      {
        field: "Socks (Internal Info)",
        description:
          "Internal details about the socks provided with the sample.",
        example: "Wool, Ankle-length",
        type: "Text",
      },
      {
        field: "Quantity (Internal Info)",
        description: "Internal record of the quantity of samples.",
        example: "10",
        type: "Numeric",
      },
      {
        field: "Comment",
        description: "Any additional comments or instructions for the sample.",
        example: "Special packaging required",
        type: "Text",
      },
      {
        field: "Prod-Ex Date",
        description: "The expected date of production completion.",
        example: "10-04-2024",
        type: "Date",
      },
      {
        field: "Delivery Date",
        description: "Scheduled date for the delivery of the sample.",
        example: "15-05-2024",
        type: "Date",
      },
      {
        field: "Delivery Address",
        description: "The address to which the sample should be delivered.",
      },
    ],
    // ... other named data
  };
  const columnDefs = [
    { headerName: "Field", field: "field", sortable: true, filter: true },
    {
      headerName: "Description",
      field: "description",
      width: 450,
      sortable: true,
      filter: true,
    },
    { headerName: "Example", field: "example", sortable: true, filter: true },
    {
      headerName: "Type",
      field: "type",
      width: 350,
      sortable: true,
      filter: true,
    },
  ];

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
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>
          </div>

          <div
            className={`ag-theme-quartz ${styles.agThemeQuartz}`}
            style={{ height: 600, width: "100%", marginTop: "10px" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={tableData[`${tableName}Info`]}
              animateRows={true}
              filter={true}
            />
          </div>
        </div>
      </div>
    )
  );
};
export default InfoPopup;
