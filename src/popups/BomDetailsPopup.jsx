import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";

import { getDataApiService } from "../service/apiService";
import CustomAgGrid from "../features/CustomAgGrid";

const  BomDetailsPopup = ({ bomId,onCancel }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [bomDetails, setBomDetails] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [rowSelect , setRowSelect]= useState(false);
  const [gridApi, setGridApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);
  
  useEffect(() => {
    if (gridApi) {
      if (isFetching) {
        gridApi.showLoadingOverlay();
      } else if (fetchError) {
        gridApi.showNoRowsOverlay();
      } else if (!isFetching && bomDetails.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        const rowDataToUpdate = [].concat(bomDetails);
        gridApi.updateGridOptions({ rowData: rowDataToUpdate });
        gridApi.hideOverlay();
      }
    }
    
  }, [gridApi, isFetching, fetchError, bomDetails]);
  
  


 const fetchBomDetails = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      if (bomId) {
        const BASE_URL = 'bom/viewbomdetails';
        const response = await getDataApiService({ bomId: bomId }, BASE_URL);
        console.log(response);
        setBomDetails(response); 
        setIsFetching(false);
      }
    } catch (error) {
      console.error(error);
      setFetchError("Failed to fetch BOM details");
      setIsFetching(false);
    }
  };
  useEffect(() => {
    fetchBomDetails();
  }, [bomId]); 


  const dateFilterParams = {
    comparator: function (filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      console.log(filterLocalDateAtMidnight);
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    },
  };
  const columnDefs = [
   
    {
      headerName: "Item ID",
      field: "item_id",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "Group",
      field: "itemGrp",
      sortable: true,
      width:150,
      filter: true,
    },
    {
      headerName: "Sub Group",
      field: "itemSubGrp",
      sortable: true,
      width:150,
      filter: true,
    },
    
    {
      headerName: "Used In",
      field: "usedIn",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "Pair",
      field: "pair",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "BOM Quantity",
      field: "bomQty",
      width:100,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Stock Consumed",
      field: "stockConsumedQty",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "Required Quantity",
      field: "reqQty",
      sortable: true,
      width:100,
      filter: true,
    },
    {
      headerName: "Rate",
      field: "rate",
      width:70,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Unit",
      field: "unit",
      width:70,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Supplier Id",
      field: "supplier_id",
      sortable: true,
      filter: true,
      width:70,
    },
  ];


  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>BOM Details</h1>
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
            style={{ width: "100%", marginTop: "10px" }}
          >
            <CustomAgGrid
                gridHeight="500px"
                rowData={bomDetails}
                columnDefs={columnDefs}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
               
              />
          </div>
          {/* <div className={styles.bottomButtonContainer}>
            <button
              disabled={!rowSelect}
              className={styles.selectPopupButton}
            //   onClick={() => {
            //     onSubmitBuyerData(selectedBuyer);
            //   }}
            >
              Select
            </button>
          </div> */}
        </div>
      </div>
    )
  );
};
export default BomDetailsPopup;
