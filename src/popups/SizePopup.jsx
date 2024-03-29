import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { useDispatch, useSelector } from "react-redux";

const  SizePopup = ({ sizeData,onCancel }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [rowSelect , setRowSelect]= useState(false);
//   const dispatch = useDispatch();
//   const { buyers, loaded, loading, error } = useSelector(
//     (state) => state.buyer
//   );

//   const [gridApi, setGridApi] = useState(null);

//   const onGridReady = useCallback((params) => {
//     setGridApi(params.api);
//   }, []);

//   const onRowDataChanged = useCallback(() => {
//     if (gridApi) {
//       gridApi.hideOverlay();
//     }
//   }, [gridApi]);

//   useEffect(() => {
//     if (gridApi && !loaded && loading) {
//       gridApi.showLoadingOverlay();
//     }
//   }, [ loaded, loading, gridApi]);

console.log(sizeData);
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

  const onRowSelected = (event) => {
    const selectedData = event.api.getSelectedRows();
    setRowSelect(selectedData.length > 0);
    setSelectedBuyer(selectedData);
  
  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Size Here</h1>
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
              rowData={[sizeData]}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
            // onGridReady={onGridReady}
            //   onSelectionChanged={onRowSelected}
            //   onRowDataChanged={onRowDataChanged}
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
export default SizePopup;
