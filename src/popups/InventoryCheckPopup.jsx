import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { useDispatch, useSelector } from "react-redux";

const  InventoryCheckPopup = ({ onCancel }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [isPopupVisible, setIsPopupVisible] = useState(true);

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


  const columnDefs = [
  
    { headerName: "Item Name", field: "bsName", sortable: true, filter: true },
    {
      headerName: "BOM Qty",
      field: "username",
      sortable: true,
      filter: true,
    },
    { headerName: "Unallocated stock", field: "bsCode", sortable: true, filter: true },
    {
      headerName: "Stock consumed",
      field: "deliveryAddress",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Required Qty",
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
              <h1>Inventory check</h1>
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
            <div className={styles.srInput}>
                <label className={styles.sampleLabel} htmlFor="srId">
                  SR ID
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="srId"
                />
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
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
              onGridReady={onGridReady}
            />
          </div>
          <div className={styles.bottomInventoryButtonContainer}>
          <h3>SR BOM(autofill)  |  Item invent(autofill) | Stock Consumed = Unallocated stock - bom Qty | Required Qty = Bom qty - stock consumed </h3>
            <button
            
              className={styles.selectPopupButton}
              onClick={() => {
                // onSubmitBuyerData(selectedBuyer);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default InventoryCheckPopup;
