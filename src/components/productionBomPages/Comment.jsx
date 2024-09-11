import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import tableStyles from "../../styles/bom.module.css";
import { v4 as uuidv4 } from 'uuid';
import CustomAgGrid from "../../features/CustomAgGrid";
const Comments = ({productionBomData, setProductionBomData ,editDetails, setEditDetails, resetTrigger, onResetDone}) => {
  const columnDefs = useMemo(
    () => [
      { field: "header", headerName: "Header" },
      { field: "comment", headerName: "Comment",width:400 },
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
  
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);

  }, []);
  
  useEffect(() => {
    if (gridApi) {
  if ( productionBomData.comments && productionBomData.comments.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, productionBomData.comments]);

  const resetNewItemState = () => {
    setNewItem({
      header: '',
      comment: '',
    });
  };
  useEffect(() => {
    if (resetTrigger) {
      setProductionBomData({ comments: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);
  const [newItem, setNewItem] = useState({
    header: '',
    comment: '',
  });
  const handleAddMaterial = () => {
    setProductionBomData((prevData) => {
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
  const updateCommentsData = (newCommentsData) => {
    setProductionBomData((prevData) => ({
      ...prevData,
      comments: newCommentsData, // Update only the overhead
    }));
  };
  
  const handleRemoveItem = (code) => {
    setProductionBomData((prevData) => {
      const updatedProduction = Array.isArray(prevData.comments) ? prevData.comments.filter((item) => item.code !== code) : [];
      return {
        ...prevData,
        comments: updatedProduction,
      };
    });
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
        style={{  width: "100%", marginTop: "10px" }}
      >
 <CustomAgGrid
  rowData={productionBomData?.comments || []}  // Fallback to empty array
  setRowData={updateCommentsData}
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

export default Comments;
