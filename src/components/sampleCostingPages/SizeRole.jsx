import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const SizeRoles = ({sampleCostingData, setSampleCostingData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {
  const columnDefs = useMemo(
    () => [
      { field: "size", headerName: "Size" , width:200},
      { field: "quantity", headerName: "Quantity" },
      { field: "extra", headerName: "Extra" },
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
              onClick={() => handleRemoveItem(params.data.size)}
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
      const updatedSizeRole = Array.isArray(prevData.sizeRoles) ? [...prevData.sizeRoles, newItem] : [newItem];
      return {
        ...prevData,
        sizeRoles: updatedSizeRole,
      };
    });
    resetNewItemState();
  };
  
  const handleRemoveItem = (code) => {
    setSampleCostingData((prevData) => {
      const updatedSizeRole = Array.isArray(prevData.sizeRoles) ? prevData.sizeRoles.filter((item) => item.code !== code) : [];
      return {
        ...prevData,
        sizeRoles: updatedSizeRole,
      };
    });
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
        style={{ height: 250, width: "100%", marginTop: "10px" }}
      >
        <AgGridReact 
          rowData={sampleCostingData.sizeRoles} 
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

export default SizeRoles;
