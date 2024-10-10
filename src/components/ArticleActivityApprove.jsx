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
  const { isCollapsed } = useSidebar();

  // Hardcoded data as seen in the image
  const [gridData, setGridData] = useState([
    { approv: "Approve", inRate: 3.75, outRate: 0, comm: 0, outComm: 0, activityName: "STROBLE FULL", department: "LASTING" },
    { approv: "Unapprove", inRate: 1.1, outRate: 0, comm: 0, outComm: 0, activityName: "CUTTING COUNTING", department: "PREPARATION" },
    { approv: "Unapprove", inRate: 0.55, outRate: 0, comm: 0, outComm: 0, activityName: "CUTTING PACKING", department: "PREPARATION" },
    { approv: "Unapprove", inRate: 3.6, outRate: 0, comm: 0, outComm: 0, activityName: "SKYWING", department: "PREPARATION" },
    { approv: "Unapprove", inRate: 0.6, outRate: 0, comm: 0, outComm: 0, activityName: "STIFFNER ZIG-ZAG", department: "PREPARATION" },
    { approv: "Approve", inRate: 0.85, outRate: 0, comm: 0, outComm: 0, activityName: "TOUPUFF ATTACHMENT", department: "PREPARATION" }
  ]);
  const approveAll = (approveValue) => {
    const updatedData = gridData.map(row => ({ ...row, approv: approveValue }));
    setGridData(updatedData);
  };

  const onRowValueChanged = (params) => {
    setGridData(prevData => prevData.map(row => 
      row === params.data ? params.data : row
    ));
    
    // Update header selection if all rows have the same value
    const allApproved = gridData.every(row => row.approv === 'Approve');
    const allUnapproved = gridData.every(row => row.approv === 'Unapprove');
    
    if (allApproved || allUnapproved) {
      approveAll(allApproved ? 'Approve' : 'Unapprove');
    }
  };
  // Column definitions for the grid
  const columnDefs = [
    {
      headerName: 'approv.',
      field: 'approv',
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
              className={`${styles.toggleButton} ${gridData.every(row => row.approv === 'Approve') ? styles.selected : ''}`}
              onClick={() => approveAll('Approve')}
            >
              Approve All
            </button>
            <span>┇</span>
            <button
              className={`${styles.toggleButton} ${gridData.every(row => row.approv === 'Unapprove') ? styles.selected : ''}`}
              onClick={() => approveAll('Unapprove')}
            >
              Unapprove All
            </button>
          </div>
        </div>
      ),
      
    },
    { headerName: "In Rate", field: "inRate", width: 150 },
    { headerName: "Out Rate", field: "outRate", width: 150 },
    { headerName: "Comm", field: "comm", width: 150 },
    { headerName: "Out Comm", field: "outComm", width: 150 },
    { headerName: "Activity Name", field: "activityName", width: 400 },
    { headerName: "Department", field: "department", width: 150 },
  ];

  const defaultColDef = {
    tooltipComponent: "customTooltip",
  };

  return (
    <div className={styles.itemDetailsTableContainer}>
      <div className={styles.parentGateReceive}>
        <div
          className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
          style={{ width: "100%" }}
        >
          <CustomAgGrid
            gridHeight="450px"
            rowData={gridData}
            columnDefs={columnDefs}
            editEnabled={false}
            cellClicked={true}
            deleteEnabled={true}
            pagination={true}
          />
        </div>
      </div>
    </div>
  );
};



const ArticleActivityApprove = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [selectedPoNo, setSelectedPoNo] = useState("");
  const [autoFillMOrder, setAutoFillMOrder] = useState(false);
  const [tempBal, setTempBal] = useState("");
  const [autoFillSizeOrder, setAutoFillSizeOrder] = useState(false);
  const [selectedSizePoNo, setSelectedSizePoNo] = useState("");




  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Activity Approval</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateTopGrid}>
     
          <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="season"
                      // value={formData.season}
                      // onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Season</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Autumn">Autumn</option>
                      <option value="Winter">Winter</option>
                    </select>
                    <span>Season</span>
                  </div>
                </div>

                {/* Buyer */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="buyer"
                      // value={formData.buyer}
                      // onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Buyer</option>
                      <option value="Buyer1">Buyer 1</option>
                      <option value="Buyer2">Buyer 2</option>
                      <option value="Buyer3">Buyer 3</option>
                    </select>
                    <span>Buyer</span>
                  </div>
                </div>
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="department"
                      // value={formData.buyer}
                      // onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Department</option>
                      <option value="Department1">Department 1</option>
                      <option value="Department2">Department 2</option>
                      <option value="Department3">Department 3</option>
                    </select>
                    <span>Department</span>
                  </div>
                </div>
                <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="articleNo"
                      // value={formData.articleNo}
                      // onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Article</option>
                      <option value="Article1">Article 1</option>
                      <option value="Article2">Article 2</option>
                      <option value="Article3">Article 3</option>
                    </select>
                    <span>Article</span>
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

export default ArticleActivityApprove;