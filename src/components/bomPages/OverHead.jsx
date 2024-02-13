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
      { field: "amount", headerName: "Amount" }
    ],
    []
  );
  const rowData = useMemo(
    () => [
      { code: "A1", head: "Salary", percent: 50, amount: 5000 },
      { code: "A2", head: "Bonus", percent: 10, amount: 1000 },
      { code: "B1", head: "Travel Allowance", percent: 20, amount: 2000 },
      { code: "B2", head: "Health Insurance", percent: 30, amount: 3000 },
      { code: "C1", head: "Pension Fund", percent: 40, amount: 4000 },
      { code: "C2", head: "Taxes", percent: 15, amount: 1500 },
    ],
    []
  );
  const itemSubGrpRef = useRef(null);
  const downshiftItemSubGrp = (
    <Downshift
      // onChange={(selectedItem) => {
      //   if (selectedItem) {
      //     setNewItem((prevNewItem) => ({
      //       ...prevNewItem,
      //       itemsubgrp: { id: selectedItem.id, name: selectedItem.name },
      //     }));
      //     toggleSuggestVisibility("itemsubgrp", false);
      //   }
      // }}
      // selectedItem={newItem.itemsubgrp}
      // itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
             // onChange: handleGrpItemChange,
              name: "itemsubgrp",
            })}
            type="text"
            ref={itemSubGrpRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
    
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddMaterial();
              }
            }}
          />


            <button
            onClick={() => {
            //  handleGrpButtonClick("itemsubgrp");
              itemSubGrpRef.current?.focus();
            }}
            className={tableStyles.searchBtn}
          
            aria-label="dropDorn"
          ></button>
         
    
        </div>
      )}
    </Downshift>
  );
  return (
    <>
      <div className={styles.topGrid}>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Over Head
          </label>
          {downshiftItemSubGrp}
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            total
          </label>
          <input
            name="total"
            type="text"
            // onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            // value={newItem.unit}
          />
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Rate
          </label>
          <input
            name="rate"
            type="text"
            // onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            //  value={newItem.unit}
          />
        </div>
        <div className={styles.colSpan}>
          <button
            onClick={(e) => {
              e.preventDefault();
              //  handleAddMaterial();
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
