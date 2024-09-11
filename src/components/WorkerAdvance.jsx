import React, { useEffect, useState } from "react";
import styles from "../styles/newPo.module.css";
import WorkMasterViewPopup from "../popups/WorkerAdvanceViewPopup";
import WorkerAdvanceViewPopup from "../popups/WorkerAdvanceViewPopup";

const WorkerAdvance = () => {
  const [formData, setFormData] = useState({
    date: "",
    karigarGroup: "",
    departmentName: "",
    contractorName: "",
    karigarName: "",
    loanAmount: "",
    advanceGiven: "",
    addConveyance: "",
    addFooding: "",
    remark: "",
    lessFromLoan: "",
    lessFromAdvance: "",
    lessConveyance: "",
    lessOtherDeduction: "",
    deductionRemark: "",
    balanceLoanAmount: "0.00",
    balanceAdvanceAmount: "0.00",
    daySummaryLoanAmount: "0.00",
    daySummaryAdvanceAmount: "0.00",
    daySummaryAddConveyance: "0.00",
    daySummaryAddFooding: "0.00",
    daySummaryLessFromLoan: "0.00",
    daySummaryLessFromAdvance: "0.00",
    daySummaryLessConveyance: "0.00",
    daySummaryLessOtherDeduction: "0.00",
    daySummaryTotalAmount: "0.00",
  });
 
  const [editIndex, setEditIndex] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    setViewDataPopup(false);
  }, [formData]);

  const [isViewData, setViewDataPopup] = useState(false);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Worker Advance</h1>
          <button
            className={styles.viewDataButton}
            onClick={() => setViewDataPopup(true)}
          >
            View Data
          </button>
        </div>

        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            {/* Left Column */}
            <div className={styles.colSpan1}>
              <div className={styles.inputbox}>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>DATE</span>
              </div>
            </div>
            <div className={styles.colSpan1}>
              <div className={styles.inputbox}>
                <input
                  type="date"
                  name="currentDate"
                  value={formData.currentDate}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>CURRENT DATE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="karigarGroup"
                  value={formData.karigarGroup}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Karigar Group</option>
                  {/* Add more options here */}
                </select>
                <span>KARIGAR GROUP</span>
              </div>
            </div>
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
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="contractorName"
                  value={formData.contractorName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Contractor</option>
                  {/* Add more options here */}
                </select>
                <span>CONTRACTOR NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  name="karigarName"
                  value={formData.karigarName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                
                </input>
                <span>KARIGAR NAME</span>
              </div>
            </div>

            {/* Numeric and Text Inputs */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>LOAN AMOUNT</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="advanceGiven"
                  value={formData.advanceGiven}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>ADVANCE GIVEN</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="addConveyance"
                  value={formData.addConveyance}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>ADD CONVEYANCE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="addFooding"
                  value={formData.addFooding}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>ADD FOODING</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>REMARK</span>
              </div>
            </div>

            {/* Deduction Inputs */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="lessFromLoan"
                  value={formData.lessFromLoan}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>LESS FROM LOAN</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="lessFromAdvance"
                  value={formData.lessFromAdvance}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>LESS FROM ADVANCE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="lessConveyance"
                  value={formData.lessConveyance}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>LESS CONVEYANCE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  name="lessOtherDeduction"
                  value={formData.lessOtherDeduction}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>LESS OTHER DEDUCTION</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="deductionRemark"
                  value={formData.deductionRemark}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  required
                />
                <span>REMARK FOR DEDUCTION</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.workerAdvancetopContainer}>
          <h1 className={styles.workerAdvancetopContainerH1}>Day Summary</h1>
          <div className={styles.gatePassReceiveTopGrid}>
            {/* Balance and Day Summary Section */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>BALANCE LOAN AMOUNT</span>
                <input
                  type="text"
                  name="balanceLoanAmount"
                  value={formData.balanceLoanAmount}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>BALANCE ADVANCE AMOUNT</span>
                <input
                  type="text"
                  name="balanceAdvanceAmount"
                  value={formData.balanceAdvanceAmount}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>LOAN AMOUNT</span>
                <input
                  type="text"
                  name="daySummaryLoanAmount"
                  value={formData.daySummaryLoanAmount}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>ADVANCE AMOUNT</span>
                <input
                  type="text"
                  name="daySummaryAdvanceAmount"
                  value={formData.daySummaryAdvanceAmount}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>ADD CONVEYANCE</span>
                <input
                  type="text"
                  name="daySummaryAddConveyance"
                  value={formData.daySummaryAddConveyance}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>ADD FOODING</span>
                <input
                  type="text"
                  name="daySummaryAddFooding"
                  value={formData.daySummaryAddFooding}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>LESS FROM LOAN</span>
                <input
                  type="text"
                  name="daySummaryLessFromLoan"
                  value={formData.daySummaryLessFromLoan}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>LESS FROM ADVANCE</span>
                <input
                  type="text"
                  name="daySummaryLessFromAdvance"
                  value={formData.daySummaryLessFromAdvance}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>LESS CONVEYANCE</span>
                <input
                  type="text"
                  name="daySummaryLessConveyance"
                  value={formData.daySummaryLessConveyance}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span>LESS OTHER DEDUCTION</span>
                <input
                  type="text"
                  name="daySummaryLessOtherDeduction"
                  value={formData.daySummaryLessOtherDeduction}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <span style={{ fontStyle: "italic" }}>TOTAL AMOUNT</span>
                <input
                  type="text"
                  name="daySummaryTotalAmount"
                  value={formData.daySummaryTotalAmount}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isViewData && (
        <WorkerAdvanceViewPopup
          onClose={() => setViewDataPopup(false)}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default WorkerAdvance;
