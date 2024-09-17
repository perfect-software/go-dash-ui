import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
const OverHead = () => {
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
      { field: "rate", headerName: "Rate" },
    ],
    []
  );
  const [rowData, setRowData] = useState([]);
  const [newItem, setNewItem] = useState({
    id: '',
    head: '',
    percent: '',
    rate: '',
  });
  const handleAddMaterial = () => {
    const newMaterial = {
      ...newItem,
      id: uuidv4(),  // Assign a unique ID
    };
  
    setRowData([...rowData, newMaterial]);
    setNewItem({ id: '', head: '', percent: '', rate: '' });
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
        style={{ width: "100%", marginTop: "10px" }}
      >
      <CustomAgGrid
                rowData={rowData}
                setRowData={setRowData}
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
