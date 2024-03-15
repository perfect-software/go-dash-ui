import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";

const Comments = () => {
  const columnDefs = useMemo(
    () => [
      { field: "header", headerName: "Header" , width:200},
      { field: "comment", headerName: "Comment" },
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
              onClick={() => handleRemoveItem(params.data.header)}
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
    comment: '',
    header: '',
  });
  const handleAddMaterial = () => {
    setRowData([...rowData, newItem]);
    setNewItem({ comment: '', header: ''});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleRemoveItem = (header) => {
    setRowData(rowData.filter((item) => item.header !== header));
  };

  return (
    <>
      <div className={styles.topGrid}>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Header
          </label>
          <input
            name="header"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.header}
          />
        </div>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Comments
          </label>
          <input
            name="comment"
            type="text"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
             value={newItem.comment}
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

export default Comments;
