import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import CustomAgGrid from "../features/CustomAgGrid";

const ArticleActivityDataViewPopup = ({ onCancel }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  // Define column headers according to the image
  const columns = [
    { headerName: "Activity Name", field: "activityName", width: 200 },
    { headerName: "Hide", field: "hide", width: 160 },
    { headerName: "For All", field: "forAll", width: 160 },
    { headerName: "Group", field: "group", width: 160 },
    { headerName: "Rate", field: "rate", width: 160 }
  ];

  // Define the hardcoded row data according to the image
  const rowData = [
    { activityName: "CUTTING COMMISSION", hide: "0", forAll: "0", group: "", rate: "1" },
    { activityName: "CUTTING RATE DIFFERENCE", hide: "0", forAll: "0", group: "", rate: "0" },
    { activityName: "DIE CUTTING", hide: "0", forAll: "0", group: "", rate: "0" },
    { activityName: "EXTRA CUTTING", hide: "0", forAll: "0", group: "", rate: "0" },
    { activityName: "HAND CUTTING", hide: "0", forAll: "0", group: "", rate: "0" }
  ];

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Activity Data</h1>
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

            <div>
              <CustomAgGrid
                gridHeight="500px"
                rowData={rowData}
                columnDefs={columns}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ArticleActivityDataViewPopup;
