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
const ButtonRenderer = ({ value, data, onClick }) => {
    return (
      <button className={styles.viewButton} onClick={() => onClick(data)}>
        {value}
      </button>
    );
  };
  
const  PurchaseOrderPopup = ({ onCancel }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [rowSelect , setRowSelect]= useState(false);
  const dispatch = useDispatch();
  const { buyers, loaded, loading, error } = useSelector(
    (state) => state.buyer
  );

  const [gridApi, setGridApi] = useState(null);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
      dispatch(fetchAllBuyers());
    }
  }, []);

  const onRowDataChanged = useCallback(() => {
    if (gridApi) {
      gridApi.hideOverlay();
    }
  }, [gridApi]);

  useEffect(() => {
    if (gridApi && !loaded && loading) {
      gridApi.showLoadingOverlay();
    }
  }, [ loaded, loading, gridApi]);

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
 
  const handlesButtonClick = (rowData) => {
   window.alert("Button clicked");
  };
  const frameworkComponents = {
    buttonRenderer: ButtonRenderer,
  };
  const columnDefs = [
    { headerName: "Select", field:'select', maxWidth: 80, checkboxSelection: true },
    { headerName: "Buyer", field: "bsName", sortable: true, filter: true },
    {
      headerName: "Entry Date",
      field: "entDate",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    },
    {
      headerName: "User Name",
      field: "username",
      sortable: true,
      filter: true,
    },
    { headerName: "Buyer Code", field: "bsCode", sortable: true, filter: true },
    {
      headerName: "Delivery Address",
      field: "deliveryAddress",
      sortable: true,
      filter: true,
    },
    {
        headerName: 'View',
        field: 'view',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: handlesButtonClick,
        },
      },
      
      
  ];

  const onRowSelected = (event) => {
    setRowSelect(!rowSelect);
    const selectedData = event.api.getSelectedRows();
    setSelectedBuyer(selectedData);
  
  };

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
        <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Purchase Order</h1>
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
          
            <div className={styles.topGrid}>
            <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="srId">
                  PO Type
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="srId"
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="srId">
                  Supplier
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="srId"
                />
              </div>
              </div>
            
          </div>

          <div
            className={`ag-theme-quartz ${styles.agThemeQuartz}`}
            style={{ height: 600, width: "100%", marginTop: "10px" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={buyers}
              pagination={true}
              frameworkComponents={frameworkComponents}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
              onGridReady={onGridReady}
              onSelectionChanged={onRowSelected}
              onRowDataChanged={onRowDataChanged}
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
              Add
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default PurchaseOrderPopup;
