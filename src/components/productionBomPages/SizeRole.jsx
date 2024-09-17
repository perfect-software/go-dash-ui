import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
const SizeRoles = ({ productionBomData, setProductionBomData ,editDetails, setEditDetails, resetTrigger, onResetDone }) => {
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
    setProductionBomData((prevData) => {
      const updatedComment = Array.isArray(prevData.sizeRoles) 
        ? [...prevData.sizeRoles, { ...newItem, id: uuidv4() }]
        : [{ ...newItem, id: uuidv4() }];
      
      return {
        ...prevData,
        sizeRoles: updatedComment,
      };
    });
    resetNewItemState();
  };
  
  const updateSizeRoleData = (newSizeRoleData) => {
    setSampleCostingData((prevData) => ({
      ...prevData,
      sizeRoles: newSizeRoleData, 
    }));
  };
  const resetNewItemState = () => {
    setNewItem({
      size: '',
      quantity: '',
      extra: '',
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleRemoveItem = (size) => {
    setProductionBomData((prevData) => {
      const updatedProduction = Array.isArray(prevData.sizeRoles) ? prevData.sizeRoles.filter((item) => item.size !== size) : [];
      return {
        ...prevData,
        sizeRoles: updatedProduction,
      };
    });
  };
  useEffect(() => {
    if (resetTrigger) {
      setProductionBomData({ sizeRoles: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);
  return (
    <>
      <div className={styles.rollGrid}>
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
        style={{ width: "100%", marginTop: "10px" }}
      >
         <CustomAgGrid
  rowData={productionBomData?.sizeRoles || []}  // Fallback to empty array
  setRowData={updateSizeRoleData}
  columnDefs={columnDefs}
  setFormData={setNewItem}
  gridHeight="210px"
  editEnabled={false}
  deleteEnabled={true}
  pagination={false}
/>
      </div>
    </>
  );
};

export default SizeRoles;
