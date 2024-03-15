import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const SizeRoles = () => {
  const columnDefs = useMemo(
    () => [
      { field: "size", headerName: "Size" , width:200},
      { field: "quantity", headerName: "Quantity" },
      { field: "soleNumber", headerName: "Sole Number" },
      { field: "print", headerName: "Print" },
      { field: "extra", headerName: "Extra" },
      { field: "rate", headerName: "Rate" },
      { field: "sizeLimit", headerName: "Size Limit" },
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
  const [rowData, setRowData] = useState([]);
  const [newItem, setNewItem] = useState({
    size: '',
    quantity: '',
    extra: '',
  });
  const handleAddMaterial = () => {
    setRowData([...rowData, newItem]);
    setNewItem({ size: '', quantity: '',extra: ''});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleRemoveItem = (size) => {
    setRowData(rowData.filter((item) => item.size !== size));
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
          <label className={styles.sampleLabel} htmlFor="itemgrp">
           Our Size
          </label>
          <input
            name="ourSize"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.ourSize}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
          Print Size
          </label>
          <input
            name="printSize"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.printSize}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Extra Pair
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
          <label className={styles.sampleLabel} htmlFor="unit">
           Rate/Pair
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

export default SizeRoles;
