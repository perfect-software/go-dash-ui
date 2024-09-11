import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
const SizeRoles = ({sampleCostingData, setSampleCostingData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 150,
        field: "select",
        headerName: "Select",
      },
   
      { field: "size", headerName: "Size" , width:200},
      { field: "quantity", headerName: "Quantity" },
      { field: "extra", headerName: "Extra" },

    ],
    []
  );
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);
  
  useEffect(() => {
    if (gridApi) {
  if ( sampleCostingData.sizeRoles && sampleCostingData.sizeRoles.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, sampleCostingData.sizeRoles]);

  const [newItem, setNewItem] = useState({
    size: '',
    quantity: '',
    extra: '',
  });
  const resetNewItemState = () => {
    setNewItem({
       size: '',
    quantity: '',
    extra: '',
    });
  };
  useEffect(() => {
    if (resetTrigger) {
      setSampleCostingData({ sizeRoles: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);

  const handleAddMaterial = () => {
    setSampleCostingData((prevData) => {
      const updatedSizeRoles = Array.isArray(prevData.sizeRoles) 
        ? [...prevData.sizeRoles, { ...newItem, id: uuidv4() }]
        : [{ ...newItem, id: uuidv4() }];
      
      return {
        ...prevData,
        sizeRoles: updatedSizeRoles,
      };
    });
    resetNewItemState();
  };
  const updateOverheadData = (newOverheadData) => {
    setSampleCostingData((prevData) => ({
      ...prevData,
      sizeRoles: newOverheadData,
    }));
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  return (
    <>
      <div className={styles.topGrid}>
      <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Size
          </label>
          <input
            name="size"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.size}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
           Quantity
          </label>
          <input
            name="quantity"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.quantity}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Extra
          </label>
          <input
            name="extra"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
             value={newItem.extra}
          />
        </div>
        <div className={styles.colSpan}>
          <button
            onClick={(e) => {
              e.preventDefault();
               handleAddMaterial();
            }}
            className={tableStyles.addBtn}
            aria-label="Search"
          >
            {" "}
            ADD{" "}
          </button>
        </div>
      </div>

      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{ width: "100%", marginTop: "10px" }}
      >
     <CustomAgGrid
  rowData={sampleCostingData?.sizeRoles || []}  // Fallback to empty array
  setRowData={updateOverheadData}
  columnDefs={columnDefs}
  setFormData={setNewItem}
  gridHeight="250px"
  editEnabled={false}
  deleteEnabled={true}
  pagination={false}
/>
      </div>
    </>
  );
};

export default SizeRoles;
