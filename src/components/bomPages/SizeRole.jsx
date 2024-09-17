import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import { v4 as uuidv4 } from 'uuid';
import CustomAgGrid from "../../features/CustomAgGrid";
const SizeRoles = () => {
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 150,
        field: "select",
        headerName: "Select",
      },
      { field: "size", headerName: "Size" , width:200},
      { field: "quantity", headerName: "Quantity" },
      { field: "extra", headerName: "Extra" },
  
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
  const newMaterial = {
    ...newItem,
    id: uuidv4(),  // Assign a unique ID
  };

  setRowData([...rowData, newMaterial]);
  setNewItem({  id:'',size: '', quantity: '',extra: '' });
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

export default SizeRoles;
