import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
const OverHead = ({sampleCostingData, setSampleCostingData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 150,
        field: "select",
        headerName: "Select",
      },
   
      { field: "head", headerName: "Head" },
      { field: "percent", headerName: "Percent %" },
      { field: "amount", headerName: "Amount" },
   
    ],
    []
  );
  
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);

  }, []);
  
  useEffect(() => {
    if (gridApi && sampleCostingData.overhead && sampleCostingData.overhead.length === 0) {
      gridApi.showNoRowsOverlay();
    } else if (gridApi) {
      gridApi.hideOverlay();
    }
  }, [gridApi, sampleCostingData.overhead]);
  const updateOverheadData = (newOverheadData) => {
    setSampleCostingData((prevData) => ({
      ...prevData,
      overhead: newOverheadData, // Update only the overhead
    }));
  };
  

  const resetNewItemState = () => {
    setNewItem({
      id: '',
      head: '',
      percent: '',
      amount: '',
    });
  };
  useEffect(() => {
    if (resetTrigger) {
      setSampleCostingData({ overhead: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);
  const [newItem, setNewItem] = useState({
    id: '',
    head: '',
    percent: '',
    amount: '',
  });
const handleAddMaterial = () => {
  setSampleCostingData((prevData) => {
    const updatedOverhead = Array.isArray(prevData.overhead) 
      ? [...prevData.overhead, { ...newItem, id: uuidv4() }]
      : [{ ...newItem, id: uuidv4() }];
    
    return {
      ...prevData,
      overhead: updatedOverhead,
    };
  });
  resetNewItemState();
};


  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
  return (
    <>
      <div className={styles.rollGrid}>
      {/* <div className={styles.colSpan}>
          
          <label className={styles.sampleLabel} htmlFor="itemgrp">
          Code
          </label>
          <input
            name="id"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.code}
          />
        </div> */}
        <div className={styles.colSpan}>

          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Over Head
          </label>
          <input
            name="head"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.head}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            SubTotal %
          </label>
          <input
            name="percent"
            type="number"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
             value={newItem.percent}
          />
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Amount
          </label>
          <input
            name="amount"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.amount}
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
        style={{  width: "100%", marginTop: "10px" }}
      >
 <CustomAgGrid
  rowData={sampleCostingData?.overhead || []}  // Fallback to empty array
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

export default OverHead;
