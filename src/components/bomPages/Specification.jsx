import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const Specifications = () => {
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
            Leather
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
            Lining
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
            Last
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
          <label className={styles.sampleLabel} htmlFor="unit">
            Insole
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
          <label className={styles.sampleLabel} htmlFor="unit">
            Heel
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
          <label className={styles.sampleLabel} htmlFor="unit">
           Socks
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
          <label className={styles.sampleLabel} htmlFor="unit">
           Socks Printing
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
      </div>
    </>
  );
};

export default Specifications;
