import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import CustomAgGrid from "../features/CustomAgGrid";



const ItemDetails = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemQty: "",
    reqQty: "",
  });

  const [data, setData] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const testDetailsColumns = [
     {
      headerName: "Select",
      field: "select",
      width: 180,
      cellRendererFramework: (params) => (
        <input type="checkbox" checked={params.value} onChange={(e) => params.context.handleSelectChange(params.node.id, e.target.checked)} />
      ),
      editable: true,
    },
    { headerName: 'Test Name', field: 'testName' },
    { headerName: 'Rate', field: 'rate' },
  ];
  const [testDetails, setTestDetails] = useState([
    { select: false, testName: "CHROMIUM VI", rate: 980 },
    { select: false, testName: "TEST 2", rate: 500 },
    { select: false, testName: "TEST 3", rate: 300 },
  ]);

  const [workOrders, setWorkOrders] = useState([
    { select: false, workOrder: "04281/01" },
    { select: false, workOrder: "04281/02" },
  ]);
  const workOrdersColumns = [
     {
      headerName: "Select",
      field: "select",
      width: 180,
      cellRendererFramework: (params) => (
        <input type="checkbox" checked={params.value} onChange={(e) => params.context.handleSelectChange(params.node.id, e.target.checked)} />
      ),
      editable: true,
    },
    { headerName: 'Work Order', field: 'workOrder' },
  ];
 


  const articles = [
    
      { articleNo: "117744", workOrder: "04281/01" },
    
   
      { articleNo: "117745", workOrder: "04281/02" },
   
   
];

const articleColumns = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 120,
    field: "select",
    headerName: "Select",
  },
 { headerName: 'Article No', field: 'articleNo',width: 180, },
 { headerName: 'Work Order', field: 'workOrder',width: 180, },
];

  return (
    <div className={styles.gatePassReceiveParentDiv}>
      <div className={styles.leftkarigarItemDiv} style={{ width: '35%' }}>
        <div>
        <CustomAgGrid
            rowData={testDetails}
            setRowData={setTestDetails}
            columnDefs={testDetailsColumns}
            gridHeight="360px"
            editEnabled={false}
            deleteEnabled={false}
            pagination={false}
            gridOpt={true}
          
          />
        </div>
      </div>

      <div className={styles.midkarigarItemDiv} style={{ width: '35%' }}>
        <div>
        <CustomAgGrid
            rowData={workOrders}
            setRowData={setWorkOrders}
            columnDefs={workOrdersColumns}
            gridHeight="360px"
            editEnabled={false}
            deleteEnabled={false}
            pagination={false}
            gridOpt={true}
          
          />
        </div>
      </div>

      <div className={styles.rightkarigarItemDiv} style={{ width: "30%" }}>
        <div >
        <CustomAgGrid
                gridHeight="360px"
                rowData={articles}
                columnDefs={articleColumns}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
        </div>
      </div>
    </div>
  );
};


const TestPO = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formData, setFormData] = useState({
    date: '',
    testLabName: '',
    buyerName: '',
    articleNo: '',
    kindAttention: '',
    season: '',
    poType: '',
    remark: ''
  });
  

  const columns = {
    date: { label: 'PO DATE', width: '140px' },
    testLabName: { label: 'TEST LAB NAME', width: '310px' },
    buyerName: { label: 'BUYER NAME', width: '250px' },
    articleNo: { label: 'ARTICLE NO.', width: '200px' },
    kindAttention: { label: 'KIND ATTENTION', width: '250px' },
    season: { label: 'SEASON', width: '200px' },
    poType: { label: 'PO TYPE', width: '200px' },
    remark: { label: 'REMARK', width: '250px' }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isViewData, setViewDataPopup] = useState(false);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Test PO</h1>
          <button className={styles.viewDataButton}  onClick={() => setViewDataPopup(true)}>View Data</button>
        </div>
        <div className={styles.karigarTopContainer}>
        <div className={styles.inputLinerGrid}>
      <div className={styles.colSpanInputLiner}>
        <div className={styles.itemDetailsInput}>
          {Object.keys(columns).map((key, index) => (
            <div key={index} className={styles.inputboxScroll}>
              <input
                type={key === 'date' ? 'date' : key === 'qty' || key === 'rate' ? 'number' : 'text'}
                name={key}
                className={styles.basicInput}
                required
                value={formData[key]}
                onChange={handleInputChange}
                style={{ width: columns[key].width }}
              />
              <span>{columns[key].label}</span>
            </div>
          ))}
        
        </div>
      </div>
    </div>
  </div>
  <div
          className={styles.receiveheadBorder}
          style={{ marginLeft: "10px", marginRight: "10px" }}
        ></div>


       <ItemDetails />
       
       
      </div>
      {isViewData && (
        <KarigarDataViewPopup
          onCancel={() => {
            setViewDataPopup(false);
          }}
       
        />
      )}
    </div>
    
  );
};

export default TestPO;