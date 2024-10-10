import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import DatePicker from "react-datepicker";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const TestReports = () => {
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
    buyer: "",
    testName: "",
    articleNo: "",
    testMethod: "",
    lab: "",
    passFail: "",
    season: "",
    supplier: "",
    manual: "",
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
      name: "Buyer Wise Test Summary",
      details: "Shows summary of tests based on the buyer.",
    },
    {
      name: "Buyer Wise Monthly Summary",
      details: "Monthly summary of tests by buyer.",
    },
    {
      name: "Buyer Wise Failed Test Summary",
      details: "Summary of failed tests for each buyer.",
    },
    {
      name: "Buyer Wise Monthly Fail Summary",
      details: "Monthly summary of failed tests for each buyer.",
    },
    {
      name: "Lab Wise Test Summary",
      details: "Summary of tests conducted by each lab.",
    },
    {
      name: "Lab Monthly Summary",
      details: "Monthly test summary for each lab.",
    },
    {
      name: "Lab Wise Failed Test Summary",
      details: "Summary of failed tests conducted by labs.",
    },
    {
      name: "Lab Monthly Fail Summary",
      details: "Monthly failed test summary for labs.",
    },
    {
      name: "Monthly Summary",
      details: "Summary of tests conducted in the month.",
    },
    {
      name: "Monthly Fail Summary",
      details: "Monthly summary of failed tests.",
    },
    {
      name: "Invoice Register",
      details: "Register of invoices for all orders.",
    },
    {
      name: "Test Register",
      details: "Register of all conducted tests.",
    },
    {
      name: "Test Data (Excel)",
      details: "Export test data in Excel format.",
    },
    {
      name: "Test Data (WorkOrder)",
      details: "Export work order related test data.",
    },
    {
      name: "Test Data (Excel Invoice-wise)",
      details: "Excel export of test data by invoice.",
    },
    {
      name: "Leather Testing Status",
      details: "Current status of leather testing.",
    },
    {
      name: "PO Not Generated",
      details: "List of Purchase Orders not yet generated.",
    },
    {
      name: "Failed Test",
      details: "List of failed tests.",
    },
    {
      name: "Failed Test (Excel)",
      details: "Excel export of failed test data.",
    }
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Test Reports</h1>
        </div>
        <div className={styles.parentReportOptions}>
          <div className={styles.leftReportOptions}>
            <div className={styles.topContainer}>
              <div className={styles.gateOutTopGrid}>
            
              <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
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
                      value={formData.buyer}
                      onChange={handleInputChange}
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

                {/* Test Name */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                    
                      name="testName"
                      value={formData.testName}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                       <option value="">Select Test Name</option>
                      <option value="Test Name 1">Test Name 1</option>
                      <option value="Test Name 2">Test Name 2</option>
                      <option value="Test Name 3">Test Name 3</option>
                     </select>
                    <span>Test Method</span>
                  </div>
                </div>
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                    
                      name="testMethod"
                      value={formData.testMethod}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                       <option value="">Select Test Method</option>
                      <option value="Test Method 1">Test Method 1</option>
                      <option value="Test Method 2">Test Method 2</option>
                      <option value="Test Method 3">Test Method 3</option>
                     </select>
                    <span>Test Method</span>
                  </div>
                </div>
                {/* Article No */}
                <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="articleNo"
                      value={formData.articleNo}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Article</option>
                      <option value="Article1">Article 1</option>
                      <option value="Article2">Article 2</option>
                      <option value="Article3">Article 3</option>
                    </select>
                    <span>Article No</span>
                  </div>
                </div>

                {/* Test Method */}
                

                {/* Lab */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="lab"
                      value={formData.lab}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Lab</option>
                      <option value="Lab1">Lab 1</option>
                      <option value="Lab2">Lab 2</option>
                      <option value="Lab3">Lab 3</option>
                    </select>
                    <span>Lab</span>
                  </div>
                </div>

                {/* Pass & Fail */}
                <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="passFail"
                      value={formData.passFail}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                    
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span>Pass & Fail</span>
                  </div>
                </div>

                {/* Season */}
               

                {/* Supplier */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Supplier</option>
                      <option value="Supplier1">Supplier 1</option>
                      <option value="Supplier2">Supplier 2</option>
                      <option value="Supplier3">Supplier 3</option>
                    </select>
                    <span>Supplier</span>
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
                {/* Manual */}
                <div className={styles.colSpan}>
                  <div className={styles.inputbox}>
                    <select
                      name="manual"
                      value={formData.manual}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Manual</option>
                      <option value="Manual1">Manual 1</option>
                      <option value="Manual2">Manual 2</option>
                      <option value="Manual3">Manual 3</option>
                    </select>
                    <span>Manual</span>
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
          <div
            className={styles.rightReportOptions}
            style={{ height: "630px" }}
          >
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

export default TestReports;
