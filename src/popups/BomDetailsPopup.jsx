import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";

import { getDataApiService } from "../service/apiService";

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
        gridApi.setRowData(bomDetails); 
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, isFetching, fetchError, bomDetails]);
  


 const fetchBomDetails = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      if (bomId) {
        const BASE_URL = 'bom/getBomDetails';
        const response = await getDataApiService({ bomId: bomId }, BASE_URL);
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
    { headerName: "Select", field:'select', maxWidth: 80, checkboxSelection: true },
    { headerName: "SR No", field: "bsName", sortable: true, filter: true },
    {
      headerName: "Item Name",
      field: "entDate",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    { headerName: "Size", field: "bsCode", sortable: true, filter: true },
    {
      headerName: "Blc. Qty",
      field: "deliveryAddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Qty",
      field: "billingAddress",
      sortable: true,
      filter: true,
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
            style={{ height: 600, width: "100%", marginTop: "10px" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={bomDetails}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
             onGridReady={onGridReady}
             overlayLoadingTemplate={
                '<span class="ag-overlay-loading-center">Loading...</span>'
              }
              overlayNoRowsTemplate={
                `<span class="ag-overlay-loading-center">${fetchError ? 'Failed to load data' : 'No data found'}</span>`
              }
      
            />
          </div>
          <div className={styles.bottomButtonContainer}>
            <button
              disabled={!rowSelect}
              className={styles.selectPopupButton}
            //   onClick={() => {
            //     onSubmitBuyerData(selectedBuyer);
            //   }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default BomDetailsPopup;
