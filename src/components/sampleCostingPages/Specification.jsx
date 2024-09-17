import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const Specifications = ({sampleCostingData, setSampleCostingData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {

  const resetNewItemState = () => {
    setNewItem({
      header: '',
      comment: '',
      last:"",
      leather:"",
      insole:"",
      heel:"",
      socks:"",
      socksPrinting:"",
      soleStamp:"",
      welt:"",
      soleEmboss:""
    });
  };
  useEffect(() => {
    if (resetTrigger) {
      setSampleCostingData({ specifications: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);
  const [newItem, setNewItem] = useState({
    header: '',
    comment: '',
    last:"",
    insole:"",
    heel:"",
    leather:"",
    socks:"",
    socksPrinting:"",
    soleStamp:"",
    welt:"",
    soleEmboss:""
  });

  const addSpecification = () => {
    setSampleCostingData((prevData) => {
      const updatedSpecifications = prevData.specifications ? [...prevData.specifications, newItem] : [newItem];
      return { ...prevData, specifications: updatedSpecifications }; 
    });
    resetNewItemState();
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
            Leather
          </label>
          <input
            name="leather"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Leather"
            value={newItem.leather}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Lining
          </label>
          <input
            name="lining"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Lining"
             value={newItem.lining}
          />
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Last
          </label>
          <input
            name="last"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Last"
            value={newItem.last}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Insole
          </label>
          <input
            name="insole"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Insole"
            value={newItem.insole}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Heel
          </label>
          <input
            name="heel"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Heel"
            value={newItem.heel}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Socks
          </label>
          <input
            name="socks"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Socks"
            value={newItem.socks}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Socks Printing
          </label>
          <input
            name="socksPrinting"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Socks Printing"
            value={newItem.socksPrinting}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Sole Stamp
          </label>
          <input
            name="soleStamp"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Sole Stamp"
            value={newItem.soleStamp}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
           Welt
          </label>
          <input
            name="welt"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Welt"
            value={newItem.welt}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
          Sole Emboss
          </label>
          <input
            name="soleEmboss"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Sole Emboss"
            value={newItem.soleEmboss}
          />
        </div>
        <div className={styles.colSpan}>
          <button
            onClick={(e) => {
              e.preventDefault();
              addSpecification();
            }}
            className={tableStyles.addBtn}
            aria-label="Search"
          >
            {" "}
            ADD{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default Specifications;
