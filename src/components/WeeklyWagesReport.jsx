import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import DatePicker from "react-datepicker";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const WeeklyWagesReport = () => {
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
    buyerName: "",
    article: "",
    workOrderRange: "",
    karigarName: "",
    contractorName: "",
    departmentName: "",
    workerName: "",
    activityName: "",
    rangeDate: "",
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
      name: "Weekly",
      details: "View weekly reports and updates for all orders and tasks.",
    },
    {
      name: "Summary",
      details:
        "Access a summarized view of all purchase orders and activities.",
    },
    {
      name: "Department Wise",
      details: "View data categorized by different departments.",
    },
    {
      name: "Article Wise",
      details: "View reports and data based on specific articles.",
    },
    {
      name: "Contractor Summary",
      details: "Access a summary of all contractors and their related tasks.",
    },
    {
      name: "Unpaid Wages",
      details:
        "Check the list of unpaid wages for different workers or departments.",
    },
    {
      name: "Activity Wise Rate Summary",
      details: "View the rate summary for different activities.",
    },
    {
      name: "Activity Wise Wages Pending",
      details: "Track wages that are pending for each activity.",
    },
    {
      name: "Karigar Ledger",
      details: "Access the ledger details of all Karigars.",
    },
    {
      name: "Karigar Advance Register",
      details: "View and manage the advance payment records for Karigars.",
    },
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Weekly Wages Report</h1>
        </div>
        <div className={styles.parentReportOptions}>
          <div className={styles.leftReportOptions}>
            <div className={styles.topContainer}>
              <div className={styles.gateOutTopGrid}>
                {/* Season */}
                <div className={styles.colSpan2}>
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
                      <option value="Buyer1">Buyer 1</option>
                      <option value="Buyer2">Buyer 2</option>
                      <option value="Buyer3">Buyer 3</option>
                    </select>
                    <span>BUYER</span>
                  </div>
                </div>

                {/* Article */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="article"
                      value={formData.article}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Article</option>
                      <option value="Article1">Article 1</option>
                      <option value="Article2">Article 2</option>
                      <option value="Article3">Article 3</option>
                    </select>
                    <span>ARTICLE NO</span>
                  </div>
                </div>

                {/* Work Order Range */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="workOrderRange"
                      value={formData.workOrderRange}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Work Order Range</option>
                      <option value="Range1">Range 1</option>
                      <option value="Range2">Range 2</option>
                      <option value="Range3">Range 3</option>
                    </select>
                    <span>WORK ORDER RANGE</span>
                  </div>
                </div>

                {/* Karigar Name */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="karigarName"
                      value={formData.karigarName}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Karigar</option>
                      <option value="Karigar1">Karigar 1</option>
                      <option value="Karigar2">Karigar 2</option>
                      <option value="Karigar3">Karigar 3</option>
                    </select>
                    <span>KARIGAR NAME</span>
                  </div>
                </div>

                {/* Contractor Name */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="contractorName"
                      value={formData.contractorName}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Contractor</option>
                      <option value="Contractor1">Contractor 1</option>
                      <option value="Contractor2">Contractor 2</option>
                      <option value="Contractor3">Contractor 3</option>
                    </select>
                    <span>CONTRACTOR NAME</span>
                  </div>
                </div>

                {/* Department Name */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="departmentName"
                      value={formData.departmentName}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Department</option>
                      <option value="Dept1">Department 1</option>
                      <option value="Dept2">Department 2</option>
                      <option value="Dept3">Department 3</option>
                    </select>
                    <span>DEPARTMENT NAME</span>
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

                {/* Worker Name */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="workerName"
                      value={formData.workerName}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Worker</option>
                      <option value="Worker1">Worker 1</option>
                      <option value="Worker2">Worker 2</option>
                      <option value="Worker3">Worker 3</option>
                    </select>
                    <span>WORKER NAME</span>
                  </div>
                </div>

                {/* Activity Name */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="activityName"
                      value={formData.activityName}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Activity</option>
                      <option value="Activity1">Activity 1</option>
                      <option value="Activity2">Activity 2</option>
                      <option value="Activity3">Activity 3</option>
                    </select>
                    <span>ACTIVITY NAME</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ margin: "10px" }}>
              <CustomAgGridSecond
                columnDefs={columnDefs}
                rowData={[]} // Pass dynamic row data here
                gridHeight="380px"
                deleteEnabled={false}
                editEnabled={false}
                pagination={true}
              />
            </div>
          </div>
          <div className={styles.rightReportOptions} style={{height:'630px'}}>
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

export default WeeklyWagesReport;
