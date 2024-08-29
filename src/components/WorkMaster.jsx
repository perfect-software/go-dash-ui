import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import WorkMasterViewPopup from "../popups/WorkMasterViewPopup";

const WorkerMaster = () => {
  const [formData, setFormData] = useState({
    karigarGroup: '',
    departmentName: '',
    contractorName: '',
    karigarName: '',
    fatherName: '',
    address: '',
    city: '',
    mobileNo: '',
    aadharNo: '',
    panNo: '',
    bankName: '',
    bankBranch: '',
    bankAcNo: '',
    ifscCode: '',
    gstNo: '',
    esiNo: '',
    pfNo: '',
    uanNo: '',
    jobLeft: '',
    tds: '',
    tdsPercent: '',
    commission: '',
    conveyance: '',
    gstPercent: '',
    dateOfJoining: '',
    dateOfLeft: '',
  });
 
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
          <h1>Worker Master</h1>
          <button className={styles.viewDataButton}  onClick={() => setViewDataPopup(true)}>View Data</button>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            {/* Left Column */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select name="karigarGroup" value={formData.karigarGroup} onChange={handleInputChange} className={styles.basicInput}>
                  <option value="">Select Karigar Group</option>
                  {/* Add more options here */}
                </select>
                <span>KARIGAR GROUP</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select name="departmentName" value={formData.departmentName} onChange={handleInputChange} className={styles.basicInput}>
                  <option value="">Select Department</option>
                  {/* Add more options here */}
                </select>
                <span>DEPARTMENT NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select name="contractorName" value={formData.contractorName} onChange={handleInputChange} className={styles.basicInput}>
                  <option value="">Select Contractor</option>
                  {/* Add more options here */}
                </select>
                <span>CONTRACTOR NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" name="karigarName" value={formData.karigarName} onChange={handleInputChange} className={styles.basicInput} required />
                <span>KARIGAR NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className={styles.basicInput} required />
                <span>FATHER NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={styles.basicInput} required />
                <span>ADDRESS</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select name="city" value={formData.city} onChange={handleInputChange} className={styles.basicInput}>
                  <option value="">Select City</option>
                  {/* Add more options here */}
                </select>
                <span>CITY</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>MOBILE NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="aadharNo" value={formData.aadharNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>AADHAR NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="panNo" value={formData.panNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>PAN NO.</span>
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select name="bankName" value={formData.bankName} onChange={handleInputChange} className={styles.basicInput}>
                  <option value="">Select Bank</option>
                  {/* Add more options here */}
                </select>
                <span>BANK NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" name="bankBranch" value={formData.bankBranch} onChange={handleInputChange} className={styles.basicInput} required />
                <span>BANK BRANCH</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" name="bankAcNo" value={formData.bankAcNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>BANK A/C NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className={styles.basicInput} required />
                <span>IFSC CODE</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="gstNo" value={formData.gstNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>GST NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="esiNo" value={formData.esiNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>ESI NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="pfNo" value={formData.pfNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>PF NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="uanNo" value={formData.uanNo} onChange={handleInputChange} className={styles.basicInput} required />
                <span>UAN NO.</span>
              </div>
            </div>

            {/* Yes/No Section */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select name="jobLeft" value={formData.jobLeft} onChange={handleInputChange} className={`${styles.basicInput} ${formData.jobLeft === 'Yes' ? styles.greenBackground : formData.jobLeft === 'No' ? styles.redBackground : ''}`}>
                  <option value="">Select</option>
                  <option value="Yes" >Yes</option>
                  <option value="No" >No</option>
                </select>
                <span>JOB LEFT</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select name="tds" value={formData.tds} onChange={handleInputChange} className={`${styles.basicInput} ${formData.tds === 'Yes' ? styles.greenBackground : formData.tds === 'No' ? styles.redBackground : ''}`}>
                  <option value="">Select</option>
                  <option value="Yes" >Yes</option>
                  <option value="No" >No</option>
                </select>
                <span>TDS</span>
              </div>
            </div>
            {formData.tds === 'Yes' && (
              <div className={styles.colSpan}>
                <div className={styles.inputbox}>
                  <input type="number" name="tdsPercent" value={formData.tdsPercent} onChange={handleInputChange} className={styles.basicInput} required />
                  <span>TDS %</span>
                </div>
              </div>
            )}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select name="commission" value={formData.commission} onChange={handleInputChange} className={`${styles.basicInput} ${formData.commission === 'Yes' ? styles.greenBackground : formData.commission === 'No' ? styles.redBackground : ''}`}>
                  <option value="">Select</option>
                  <option value="Yes" >Yes</option>
                  <option value="No" >No</option>
                </select>
                <span>COMMISSION</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select name="conveyance" value={formData.conveyance} onChange={handleInputChange} className={`${styles.basicInput} ${formData.conveyance === 'Yes' ? styles.greenBackground : formData.conveyance === 'No' ? styles.redBackground : ''}`}>
                  <option value="">Select</option>
                  <option value="Yes" >Yes</option>
                  <option value="No" >No</option>
                </select>
                <span>CONVEYANCE</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" name="gstPercent" value={formData.gstPercent} onChange={handleInputChange} className={styles.basicInput} required />
                <span>GST Percent</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} className={styles.basicInput} required />
                <span>DATE OF JOINING</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="date" name="dateOfLeft" value={formData.dateOfLeft} onChange={handleInputChange} className={styles.basicInput} required />
                <span>DATE OF LEFT</span>
              </div>
            </div>
          </div>
        </div>
       <div className={styles.saveButtonContainer}>
       <button className={styles.saveDataButton} >Save Data</button>
       </div>
      </div>
      {isViewData && (
        <WorkMasterViewPopup
        setFormData={setFormData}
          onClose={() => {
            setViewDataPopup(false);
          }}
       
        />
      )}
    </div>
  );
};

export default WorkerMaster;
