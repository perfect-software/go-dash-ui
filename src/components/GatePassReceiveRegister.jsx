import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import DatePicker from "react-datepicker";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const GatePassReceiveRegister = () => {
  const [orderStatus, setOrderStatus] = useState({
    production: false,
    sample: false,
    other: false,
    balanceInWorkOrder: false,
    stockTransfer: false,
    sizeRequired: false,
  });

  const handleCheckboxChange = (checkboxName) => {
    setOrderStatus({
      ...orderStatus,
      [checkboxName]: !orderStatus[checkboxName],
    });
  };

  const [formData, setFormData] = useState({
    documentType: "",
    supplierName: "",
    itemName: "",
    itemGroup: "",
    type: "",
    store: "",
    natureOfJob: "",
    companyUnit: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [orderRange, setOrderRange] = useState([null, null]);
  const options = [
    {
      name: "Gate Pass Receive Register",
      details: "Records of all received gate passes.",
    },

  ];

  const columnDefs = [
    // Define columns based on your grid data
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Gate Pass Receive Register</h1>
        </div>

        <div className={styles.parentReportOptions}>
          <div className={styles.leftReportOptions}>
            <div className={styles.topContainer}>
              <div className={styles.gateOutTopGrid}>
                {/* Season */}

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
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Document Type</option>
                      {/* Add more options here */}
                    </select>
                    <span>DOCUMENT TYPE</span>
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

                {/* User */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Type</option>
                      {/* Add more options here */}
                    </select>
                    <span>TYPE</span>
                  </div>
                </div>
    
                <div className={styles.colSpan2}>
                  <DateRangePicker
                    appearance="default"
                    placeholder="Select date range"
                    value={orderRange}
                    onChange={(dates) => setOrderRange(dates)}
                  />
                </div>
                {/* Cancelled PO */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="store"
                      value={formData.store}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="Select Store">Select Store</option>
                  
                    </select>
                    <span>STORE</span>
                  </div>
                </div>
                <div className={styles.colSpan2}>
                  <div className={styles.orderInTopGrid2}>
                    <div className={styles.inputbox}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          name="sizeRequired"
                          checked={orderStatus.sizeRequired}
                          onChange={() => handleCheckboxChange("sizeRequired")}
                          className={styles.customCheckbox}
                        />
                        Size Required
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "10px" }}>
              <CustomAgGridSecond
                columnDefs={columnDefs}
                rowData={[]} // Pass dynamic row data here
                gridHeight="430px"
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
                  <h2> {option.name}</h2>
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

export default GatePassReceiveRegister;
