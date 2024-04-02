import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const OverHead = ({sampleCostingData, setSampleCostingData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {
  const columnDefs = useMemo(
    () => [
      { field: "code", headerName: "Code" },
      { field: "head", headerName: "Head" },
      { field: "percent", headerName: "%" },
      { field: "amount", headerName: "amount" },
      {
        field: 'action',
        headerName: 'Action',
        cellStyle: { textAlign: 'center' },
        cellRenderer: function (params) {
          return (
            <div style={{
              height: '100%', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center' 
            }}>
              <button  className={tableStyles.minus}
              onClick={() => handleRemoveItem(params.data.code)}
              >
              </button>
            </div>
          );
        },
    },
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
  

  const resetNewItemState = () => {
    setNewItem({
      code: '',
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
    code: '',
    head: '',
    percent: '',
    amount: '',
  });
  const handleAddMaterial = () => {
    setSampleCostingData((prevData) => {
      const updatedOverhead = Array.isArray(prevData.overhead) ? [...prevData.overhead, newItem] : [newItem];
      return {
        ...prevData,
        overhead: updatedOverhead,
      };
    });
    resetNewItemState();
  };
  
  const handleRemoveItem = (code) => {
    setSampleCostingData((prevData) => {
      const updatedOverhead = Array.isArray(prevData.overhead) ? prevData.overhead.filter((item) => item.code !== code) : [];
      return {
        ...prevData,
        overhead: updatedOverhead,
      };
    });
  }; 
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };
  return (
    <>
      <div className={styles.rollGrid}>
      <div className={styles.colSpan}>
          
          <label className={styles.sampleLabel} htmlFor="itemgrp">
          Code
          </label>
          <input
            name="code"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.code}
          />
        </div>
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
            amount
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
        style={{ height: 250, width: "100%", marginTop: "10px" }}
      >
  <AgGridReact 
          rowData={sampleCostingData.overhead} 
          onGridReady={onGridReady}
          columnDefs={columnDefs}
          overlayNoRowsTemplate={
            `<span class="ag-overlay-loading-center">No data found</span>`
          }
        />
      </div>
    </>
  );
};

export default OverHead;
