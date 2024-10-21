import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { Country, State, City } from "country-state-city";
import Currencydata from "currency-codes/data";
import Edit3dIcon from "../assets/edit3d.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import UpIcon from "../assets/up.svg";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import AutoTable from "../features/AutoTable";
import { postApiService } from "../service/apiService";
import ViewBuyer from "./ViewBuyer";
import Downshift from "downshift";
import VerifiedIcon from "../assets/verified.svg";
import SizeIcon from "../assets/sizeButton.svg";
import WorkIcon from "../assets/workOrderButton.svg";


import { generatePDF } from "../features/generateBuyerPDF";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchAllItemRates } from "../reducer/itemRateSlice";
import { useSelector, useDispatch } from "react-redux";
import tableStyles from "../styles/bom.module.css";
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import CustomAgGrid from "../features/CustomAgGrid";

const ItemDetails = () => {


  const [ticketData, setTicketData] = useState([
    { select: false, ticketNo: "00350/01/001-00001", pairQty: 10 },
    { select: false, ticketNo: "00350/01/001-00002", pairQty: 10 },
    { select: true, ticketNo: "00350/01/001-00002", pairQty: 30 },
  
  ]);

  const columns = [
    {
      headerName: "Select",
      field: "select",
      width: 180,
      cellRendererFramework: (params) => (
        <input type="checkbox" checked={params.value} onChange={(e) => params.context.handleSelectChange(params.node.id, e.target.checked)} />
      ),
      editable: true,
    },
    { headerName: "Ticket No.", field: "ticketNo", width: 250 },
    { headerName: "Pair Qty", field: "pairQty", width: 100 },
  ];


  const sizeColumns = [
    { headerName: "Size", field: "size", width: 100 },
    { headerName: "Balance Qty", field: "balanceQty", width: 150 },
    { headerName: "Qty", field: "qty", width: 100 },
  ];

  const sizeRowData = [
    { size: "Small", balanceQty: 10, qty: 5 },
    { size: "Medium", balanceQty: 20, qty: 10 },
    { size: "Large", balanceQty: 30, qty: 15 },
  ];

  return (
    <div className={styles.gatePassReceiveParentDiv}>
      <div className={styles.leftkarigarItemDiv} style={{ width: "60%" }}>
        <div>
          <CustomAgGrid
            rowData={ticketData}
            setRowData={setTicketData}
            columnDefs={columns}
            gridHeight="340px"
            editEnabled={false}
            deleteEnabled={false}
            pagination={true}
            gridOpt={true}
          
          />
        </div>
      </div>
      <div className={styles.rightkarigarItemDiv} style={{ width: "40%" }}>
        <div
          className={`ag-theme-quartz ${styles.agThemeQuartz}`}
          style={{  width: "100%" }}
        >
          <CustomAgGrid
            gridHeight="340px"
            rowData={sizeRowData}
            columnDefs={sizeColumns}
            editEnabled={false}
            deleteEnabled={false}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

const KarigarJobCardReceive = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formData, setFormData] = useState({
  
    group: "",
    department: "",
    karigarName: "",
    articleNo: "",
    workOrderNo: "",
    activityName: "",
    sampleRequestNo: "",
    repairSlipNo: "",
    remark: "",
    qty: "",
    rate: "",
  });

  const columns = {
  
    group: { label: 'Group', width: '200px' },
    articleNo: { label: 'Article No.', width: '130px' },
    activityName: { label: 'Activity Name', width: '200px' },
    karigarName: { label: 'Karigar Name', width: '285px' },
    sampleRequestNo: { label: 'Sample Request No.', width: '140px' },
    department: { label: 'Department', width: '200px' },
    workOrderNo: { label: 'Work Order No.', width: '130px' },
    repairSlipNo: { label: 'Repair Slip No.', width: '140px' },
    remark: { label: 'Remark', width: '180px' },
    qty: { label: 'Qty', width: '70px' },
    rate: { label: 'Rate', width: '70px' },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isViewData, setViewDataPopup] = useState(false);
  
    const [formData2, setFormData2] = useState({
      date: '',
      jobType: '',
      year: new Date().getFullYear().toString(),
      jobCardNo: ''
    });
  
    const handleInputChange2 = (e) => {
      const { name, value } = e.target;
      setFormData2({ ...formData2, [name]: value });
    };
  
    const handleJobCardInputEnter = (e) => {
      if (e.key === 'Enter') {
        const { year, jobCardNo } = formData2;
        
        // Extract last two digits of the year
        const yearLastTwoDigits = year.slice(-2);
        
        // Calculate the number of zeros needed
        const zerosNeeded = 8 - jobCardNo.length; // 10 total length - 2 (year) = 8
        
        // Ensure the zeros needed is non-negative
        const middleZeros = zerosNeeded > 0 ? '0'.repeat(zerosNeeded) : '';
        
        // Formatted job card number
        const formattedJobCardNo = `${yearLastTwoDigits}${middleZeros}${jobCardNo}`;
        
        // Update formData with the formatted job card number
        setFormData2({ ...formData2, jobCardNo: formattedJobCardNo });
      }
    };
    
    
  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Karigar Job Card Receive</h1>
          <button
            className={styles.viewDataButton}
            onClick={() => setViewDataPopup(true)}
          >
            View Data
          </button>
        </div>
        <div className={styles.gatePassReceivetopContainer}>
  <div className={styles.gatePassReceiveTopGrid}>
    <div className={styles.colSpan}>
      <div className={styles.inputbox}>
        <input
          type="date"
          className={styles.basicInput}
          name="date"
          required
          value={formData2.date}
          onChange={handleInputChange2}
       
        />
        <span>Date</span>
      </div>
    </div>

    <div className={styles.colSpan}>
      <div className={styles.inputbox}>
        <select
          className={styles.basicInput}
          name="jobType"
          value={formData2.jobType}
          onChange={handleInputChange2}
       
        >
          <option value="">Job Type</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
        </select>
        <span>Job Type</span>
      </div>
    </div>

    <div className={styles.colSpan}>
      <div className={styles.inputbox}>
        <select
          className={styles.basicInput}
          name="year"
       
          value={formData2.year}
          onChange={handleInputChange2}
        >
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <span>Year</span>
      </div>
    </div>

    <div className={styles.colSpan}>
      <div className={styles.inputbox}>
        <input
          type="number"
          className={styles.basicInput}
       
          name="jobCardNo"
          value={formData2.jobCardNo}
          onChange={handleInputChange2}
          onKeyDown={handleJobCardInputEnter}
        />
        <span>Job Card Number</span>
      </div>
    </div>
  </div>
</div>

     
        <div className={styles.karigarTopContainer}>
          <div className={styles.inputLinerGrid}>
            <div className={styles.colSpanInputLiner}>
              <div className={styles.itemDetailsInput}>
                {Object.keys(columns).map((key, index) => (
                  <div key={index} className={styles.inputboxScroll}>
                    <input
                      type={
                        key === "date"
                          ? "date"
                          : key === "qty" || key === "rate"
                          ? "number"
                          : "text"
                      }
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
            <div>
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

export default KarigarJobCardReceive;
