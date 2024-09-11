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
import CustomAgGrid from "../features/CustomAgGrid";

const  InventoryCheckPopup = ({ onCancel }) => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  const dispatch = useDispatch();
  const { buyers, loaded, loading, error } = useSelector(
    (state) => state.buyer
  );

  useEffect(() => {
    dispatch(fetchAllBuyers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteSample(id));
  };



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
            style={{  width: "100%", marginTop: "10px" }}
          >
            <CustomAgGrid
                gridHeight="400px"
                rowData={buyers}
                columnDefs={columnDefs}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
               
              />
          </div>
          <div className={styles.bottomInventoryButtonContainer}>
          <h3>SR BOM(autofill)  |  Item invent(autofill) | Stock Consumed = Unallocated stock - bom Qty | Required Qty = Bom qty - stock consumed </h3>
            {/* <button
            
              className={styles.selectPopupButton}
              onClick={() => {
                // onSubmitBuyerData(selectedBuyer);
              }}
            >
              Next
            </button> */}
          </div>
        </div>
      </div>
    )
  );
};
export default InventoryCheckPopup;
