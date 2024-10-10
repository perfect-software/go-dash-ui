import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import DatePicker from "react-datepicker";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const MaterialIssueRegister = () => {
  const [orderStatus, setOrderStatus] = useState({
    production: false,
    sample: false,
    other: false,
    balanceInWorkOrder: false,
    stockTransfer: false, 
  });
  

  const handleCheckboxChange = (checkboxName, group) => {
    switch (group) {
      case "productionSampleOther":
        setOrderStatus({
          ...orderStatus,
          production: checkboxName === "production",
          sample: checkboxName === "sample",
          other: checkboxName === "other",
        });
        break;
      case "balance":
        setOrderStatus({
          ...orderStatus,
          [checkboxName]: !orderStatus[checkboxName], 
        });
        break;
      default:
        setOrderStatus({
          ...orderStatus,
          [checkboxName]: !orderStatus[checkboxName], 
        });
        break;
    }
  };
  
  const [formData, setFormData] = useState({
    season: "",
    buyer: "",
    article: "",
    workOrderRange: "",
    supplierName: "",
    itemName: "",
    itemGroup: "",
    poNo: "",
    departmentName: "",
    workerName: "",
    store: "",
    rangeDate:""
   
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [orderRange, setOrderRange] = useState([null, null]);

  const columnDefs = [
    // Define columns based on your grid data
  ];
  const options = [
    {
      name: "Balance in Work Order",
      details: "Check the remaining balance in each work order.",
    },
    {
      name: "Stock Transfer (Item - Item)",
      details: "Manage the transfer of stock between different items.",
    },
    {
      name: "Issue Register",
      details: "Track and record the issues related to stock or orders.",
    },
  ];
  
  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Material Issue Register</h1>
        </div>
        <div className={styles.parentReportOptions}>
        <div className={styles.leftReportOptions}>
        <div className={styles.parentInOrder}>
          {/* First Group: Production, Sample, Other */}
          <div className={styles.orderInTopGrid}>
            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="production"
                  checked={orderStatus.production}
                  onChange={() =>
                    handleCheckboxChange("production", "productionSampleOther")
                  }
                  className={styles.customCheckbox}
                />
                Production
              </label>
            </div>

            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="sample"
                  checked={orderStatus.sample}
                  onChange={() =>
                    handleCheckboxChange("sample", "productionSampleOther")
                  }
                  className={styles.customCheckbox}
                />
                Sample
              </label>
            </div>

            <div className={styles.inputbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="other"
                  checked={orderStatus.other}
                  onChange={() =>
                    handleCheckboxChange("other", "productionSampleOther")
                  }
                  className={styles.customCheckbox}
                />
                Other
              </label>
            </div>
          </div>

        </div>

        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            {/* Season */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Season</option>
                  {/* Add more options here */}
                </select>
                <span>SEASON</span>
              </div>
            </div>

            {/* Buyer */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="buyer"
                  value={formData.buyer}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Buyer</option>
                  {/* Add more options here */}
                </select>
                <span>BUYER</span>
              </div>
            </div>

           

            {/* Article */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select
                  name="article"
                  value={formData.article}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Article</option>
                  {/* Add more options here */}
                </select>
                <span>ARTICLE</span>
              </div>
            </div>

            {/* Work Order */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="workOrder"
                  value={formData.workOrderRange}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Work Order</option>
                  {/* Add more options here */}
                </select>
                <span>WORK ORDER RANGE</span>
              </div>
            </div>

            {/* Supplier Name */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Supplier</option>
                  {/* Add more options here */}
                </select>
                <span>SUPPLIER NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="poNo"
                  value={formData.poNo}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Po No.</option>
                </select>
                <span>Po No.</span>
              </div>
            </div>
            {/* Item Name */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Item</option>
                  {/* Add more options here */}
                </select>
                <span>ITEM NAME</span>
              </div>
            </div>

            {/* Item Group */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="itemGroup"
                  value={formData.itemGroup}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Item Group</option>
                  {/* Add more options here */}
                </select>
                <span>ITEM GROUP</span>
              </div>
            </div>

            <div className={styles.colSpan2}>
              <DateRangePicker
                appearance="default"
                placeholder="Select date range"
                value={orderRange}
                style={{ width: 350 }}
                onChange={(dates) => setOrderRange(dates)}
              />
      
            </div>
            
            {/* Buyer Order */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Department Name</option>
                  {/* Add more options here */}
                </select>
                <span>DEPARTMENT NAME</span>
              </div>
            </div>
             {/* Buyer Order */}
             <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="workerName"
                  value={formData.workerName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Worker Name</option>
                  {/* Add more options here */}
                </select>
                <span>WORKER NAME</span>
              </div>
            </div>
            {/* Store */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Store</option>
                  {/* Add more options here */}
                </select>
                <span>STORE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="store"
                  value={formData.store}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Unit</option>
                  {/* Add more options here */}
                </select>
                <span>COMPANY UNIT</span>
              </div>
            </div>
           
            {/* Cancelled PO */}
           
          </div>
        </div>
        <div style={{ margin: "10px" }}>
        <CustomAgGridSecond
          columnDefs={columnDefs}
          rowData={[]} // Pass dynamic row data here
          gridHeight="320px"
          deleteEnabled={false}
          editEnabled={false}
          pagination={true}
        />
      </div>
        </div>
        <div className={styles.rightReportOptions}>
            <div className={styles.listScroll}>
              {options.map((option, index) => (
                <div className={styles.listRow2} key={index}>
               <h2>   {option.name}</h2>
                  <span className={styles.gstinTag}>{option.details}</span>
                </div>
              ))}
            </div>

             <div className={styles.rightReportOptionsButton}>
              <button className={styles.submitButton}>Export</button>
             </div>
          </div>
        </div>
      </div>
   
    </div>
  );
};

export default MaterialIssueRegister;
