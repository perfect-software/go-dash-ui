import React, { useState } from "react";
import styles2 from "../styles/inputDetails.module.css";
import styles from "../styles/newPo.module.css";
import CustomAgGridSecond from "../features/CustomAgGridSecond";
import DatePicker from "react-datepicker";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
const KarigarJobRegister = () => {
  const [orderStatus, setOrderStatus] = useState({
    sizeRequired: false,
  });

  const handleCheckboxChange = (checkboxName) => {
    setOrderStatus({
      ...orderStatus,
      [checkboxName]: !orderStatus[checkboxName],
    });
  };

  const [formData, setFormData] = useState({
    article: "",
    activity: "",
    workOrder: "",
    karigarName: "",
    departmentName: "",
    contractorName: "",
    dateRange: "",
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
      name: "Job to be Created",
      details: "List of jobs that are yet to be created and assigned.",
    },
    {
      name: "Issue Job Card Register",
      details:
        "Record and track the issuance of job cards to workers or departments.",
    },
    {
      name: "Receive Job Card Register",
      details: "Track and manage the job cards received after job completion.",
    },
    {
      name: "Pending Job (On Floor)",
      details: "View the list of jobs currently pending on the work floor.",
    },
    {
      name: "Department Wise Balance Job Card",
      details: "Check the balance of job cards across different departments.",
    },
  ];

  const columnDefs = [
    // Define columns based on your grid data
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Karigar Job Register</h1>
        </div>

        <div className={styles.parentReportOptions}>
          <div className={styles.leftReportOptions}>
            <div className={styles.topContainer}>
              <div className={styles.gateOutTopGrid}>
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
                      {/* Add more options here */}
                    </select>
                    <span>ARTICLE</span>
                  </div>
                </div>

                {/* Activity */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="activity"
                      value={formData.activity}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Activity</option>
                      {/* Add more options here */}
                    </select>
                    <span>ACTIVITY</span>
                  </div>
                </div>

                {/* Work Order */}
                <div className={styles.colSpan2}>
                  <div className={styles.inputbox}>
                    <select
                      name="workOrder"
                      value={formData.workOrder}
                      onChange={handleInputChange}
                      className={styles.basicInput}
                    >
                      <option value="">Select Work Order</option>
                      {/* Add more options here */}
                    </select>
                    <span>WORK ORDER</span>
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
                      <option value="">Select Karigar Name</option>
                      {/* Add more options here */}
                    </select>
                    <span>KARIGAR NAME</span>
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
                      {/* Add more options here */}
                    </select>
                    <span>DEPARTMENT NAME</span>
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
                      <option value="">Select Contractor Name</option>
                    </select>
                    <span>CONTRACTOR NAME</span>
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

export default KarigarJobRegister;
