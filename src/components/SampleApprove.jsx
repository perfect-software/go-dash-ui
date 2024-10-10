import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { gsap } from 'gsap';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { useSelector, useDispatch } from "react-redux";
import tableStyles from "../styles/bom.module.css";
import CustomAgGrid from "../features/CustomAgGrid";


const ItemDetails = () => {
  const [gridData, setGridData] = useState([
    { app: 'Approve', wordNo: '24000061', article: 'NADAL-635', soleName: '', createDate: '24-Jul-2024', appDateY: '27-Aug-2024', appDateA: '30-Dec-1899', appDateN: '30-Dec-1899', print: '' },
    { app: 'Approve', wordNo: '24000059', article: 'MONE-01N', soleName: '', createDate: '24-Jul-2024', appDateY: '31-Jul-2024', appDateA: '30-Dec-1899', appDateN: '30-Dec-1899', print: '' },
    { app: 'Approve', wordNo: '24000070', article: 'MASSI-01', soleName: '', createDate: '24-Jul-2024', appDateY: '31-Jul-2024', appDateA: '30-Dec-1899', appDateN: '30-Dec-1899', print: '' },
    // Add more hardcoded rows as needed...
  ]);

  // Approve/Unapprove functionality
  const approveAll = (approveValue) => {
    const updatedData = gridData.map(row => ({ ...row, app: approveValue }));
    setGridData(updatedData);
  };

  const onRowValueChanged = (params) => {
    setGridData(prevData => prevData.map(row => 
      row === params.data ? params.data : row
    ));
    
    // Update header selection if all rows have the same value
    const allApproved = gridData.every(row => row.app === 'Approve');
    const allUnapproved = gridData.every(row => row.app === 'Unapprove');
    
    if (allApproved || allUnapproved) {
      approveAll(allApproved ? 'Approve' : 'Unapprove');
    }
  };

  const columnDefs = [

    {
      headerName: 'App.',
      field: 'app',
      width: 250,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Approve', 'Unapprove'],
      },
      onCellValueChanged: params => onRowValueChanged(params),
      headerComponent: (params) => (
        <div className={styles.agGridHeaderToggle}>
        
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleButton} ${gridData.every(row => row.app === 'Approve') ? styles.selected : ''}`}
              onClick={() => approveAll('Approve')}
            >
              Approve All
            </button>
            <span>┇</span>
            <button
              className={`${styles.toggleButton} ${gridData.every(row => row.app === 'Unapprove') ? styles.selected : ''}`}
              onClick={() => approveAll('Unapprove')}
            >
              Unapprove All
            </button>
          </div>
        </div>
      ),
      
    },
    { headerName: 'SR No.', field: 'wordNo', width: 150 },
    { headerName: 'Article', field: 'article', width: 150 },
    { headerName: 'Create Date', field: 'createDate', width: 150 },
    { headerName: 'Approve Date', field: 'appDateY', width: 150 },
    { headerName: 'Unapprove Date', field: 'appDateN', width: 150 },
  ];
  return (
    <div className={styles.itemDetailsTableContainer}>
    
     <div className={styles.parentGateReceive}>
     <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{  width: "100%" }}
      >
       <CustomAgGrid
                gridHeight="450px"
                rowData={gridData}
                columnDefs={columnDefs}
                cellClicked={true}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
      </div>

    
     </div>
     


    </div>
  );
};


const SampleApprove = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [selectedPoNo, setSelectedPoNo] = useState("");
  const [autoFillMOrder, setAutoFillMOrder] = useState(false);
  const [tempBal, setTempBal] = useState("");
  const [autoFillSizeOrder, setAutoFillSizeOrder] = useState(false);
  const [selectedSizePoNo, setSelectedSizePoNo] = useState("");

  const [data, setData] = useState([
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Doe', age: 32 },
    { id: 3, name: 'Billy Joe', age: 45 }
  ]);




  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Sample Approved</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateTopGrid}>
          <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="season"
                     // value={formData.documentType}
                    //  onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Season</option>
                      {/* Add more options here */}
                    </select>
                    <span>Season</span>
                  </div>
                </div>
      
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="buyerName"
                    //  value={formData.documentType}
                   //   onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Buyer</option>
                      {/* Add more options here */}
                    </select>
                    <span>Buyer</span>
                  </div>
                </div>


                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="article"
                     // value={formData.documentType}
                    //  onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Article</option>
                      {/* Add more options here */}
                    </select>
                    <span>ARTICLE</span>
                  </div>
                </div>

          </div>
        </div>
        <div className={styles.drtrmidDetails}>
        
        </div>
        {activePage === "itemDetails" && <ItemDetails />}
    
      </div>

    </div>
  );
};

export default SampleApprove;