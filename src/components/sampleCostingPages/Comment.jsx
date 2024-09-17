import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import CustomAgGrid from "../../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
const Comments = ({sampleCostingData, setSampleCostingData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {
  const columnDefs = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 150,
        field: "select",
        headerName: "Select",
      },
      { field: "header", headerName: "Header" },
      { field: "comment", headerName: "Comment",width:400 },
   
    ],
    []
  );
  
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);

  }, []);
  
  useEffect(() => {
    if (gridApi) {
  if ( sampleCostingData.comments && sampleCostingData.comments.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, sampleCostingData.comments]);

  const resetNewItemState = () => {
    setNewItem({
      header: '',
      comment: '',
    });
  };

  const updateOverheadData = (newOverheadData) => {
    setSampleCostingData((prevData) => ({
      ...prevData,
      comments: newOverheadData, 
    }));
  };
  useEffect(() => {
    if (resetTrigger) {
      setSampleCostingData({ comments: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);
  const [newItem, setNewItem] = useState({
    header: '',
    comment: '',
  });
  const handleAddMaterial = () => {
    setSampleCostingData((prevData) => {
      const updatedComment = Array.isArray(prevData.comments) 
        ? [...prevData.comments, { ...newItem, id: uuidv4() }]
        : [{ ...newItem, id: uuidv4() }];
      
      return {
        ...prevData,
        comments: updatedComment,
      };
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
        <div className={styles.colSpan}>

          <label className={styles.sampleLabel} htmlFor="itemgrp">
          Comment
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
        style={{ width: "100%", marginTop: "10px" }}
      >
 <CustomAgGrid
  rowData={sampleCostingData?.comments || []}  // Fallback to empty array
  setRowData={updateOverheadData}
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

export default Comments;
