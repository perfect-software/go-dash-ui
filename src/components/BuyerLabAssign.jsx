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

  const [gridData, setGridData] = useState([]);




  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
   
    { headerName: "Test Name", field: "testName", width: 400 },


    
  ];

  const defaultColDef = {
    tooltipComponent: "customTooltip",
  };

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
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
      </div>

    
     </div>
     


    </div>
  );
};


const BuyerLabAssign = () => {
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

  const handleDelete = (id) => {
    const element = document.getElementById(`row-${id}`);
    const tl = gsap.timeline();

    tl.to(element, { 
      y: '-15px', 
      scaleY: 0.9, 
      duration: 0.3 
    })
    .to(element, { 
      morphSVG: '#step-2', 
      duration: 0.3 
    })
    .to(element, { 
      morphSVG: '#step-3', 
      duration: 0.3 
    })
    .to(element, {
      y: '0',
      scaleY: 1,
      duration: 0.3,
      onComplete: () => {
        setData(data.filter(item => item.id !== id));
      }
    });
  };



  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Buyer Lab Assign</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateTopGrid}>
     
          <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="labName"
                     // value={formData.documentType}
                    //  onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Lab Name</option>
                      {/* Add more options here */}
                    </select>
                    <span>LAB NAME</span>
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
                      <option value="">Select Buyer Name</option>
                      {/* Add more options here */}
                    </select>
                    <span>Buyer Name</span>
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

export default BuyerLabAssign;