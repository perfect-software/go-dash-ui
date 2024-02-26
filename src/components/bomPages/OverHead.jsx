import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const OverHead = () => {
  const columnDefs = useMemo(
    () => [
      { field: "code", headerName: "Code" },
      { field: "head", headerName: "Head" },
      { field: "percent", headerName: "%" },
      { field: "rate", headerName: "rate" },
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
  const [rowData, setRowData] = useState([]);
  const [newItem, setNewItem] = useState({
    code: '',
    head: '',
    percent: '',
    rate: '',
  });
  const handleAddMaterial = () => {
    setRowData([...rowData, newItem]);
    setNewItem({ code: '', head: '', percent: '', rate: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleRemoveItem = (code) => {
    setRowData(rowData.filter((item) => item.code !== code));
  };

  return (
    <>
      <div className={styles.topGrid}>
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
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
             value={newItem.percent}
          />
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Rate
          </label>
          <input
            name="rate"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.rate}
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
        <AgGridReact rowData={rowData} columnDefs={columnDefs} />
      </div>
    </>
  );
};

export default OverHead;
