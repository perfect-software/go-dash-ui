import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/popupTable.module.css";
import styles2 from "../styles/newPo.module.css";
import Cross from "../assets/cross.svg";
import AutoTable from "../features/AutoTable";

const WorkMasterViewPopup = ({ onClose, setIsEditing, setEditIndex, setFormData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [jobLeft, setJobLeft] = useState("");
  const [karigarGroup, setKarigarGroup] = useState("");
  const [department, setDepartment] = useState("");
  const [contractor, setContractor] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const columns = {
    jobLeft: { label: "Job Left", path: "jobLeft", width: "50px" },
    karigarName: { label: "Karigar Name", path: "karigarName", width: "140px" },
    contractorName: { label: "Contractor Name", path: "contractorName", width: "140px" },
    mobileNo: { label: "Mobile No.", path: "mobileNo", width: "120px" },
    aadharNo: { label: "Aadhar No.", path: "aadharNo", width: "140px" },
    panNo: { label: "PAN No.", path: "panNo", width: "140px" },
    bankName: { label: "Bank Name", path: "bankName", width: "140px" },
    bankAccNo: { label: "Bank A/C No.", path: "bankAccNo", width: "140px" },
    gstNo: { label: "GST No.", path: "gstNo", width: "140px" },
    karigarGroup: { label: "Karigar Group", path: "karigarGroup", width: "140px" },
    department: { label: "Department", path: "department", width: "140px" }
  };

  const rowData = [
    {
      jobLeft: 'Yes',
      karigarName: 'John Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group A',
      department: 'Dept 1'
    },
    {
      jobLeft: 'No',
      karigarName: 'Jane Smith',
      contractorName: 'XYZ Ltd',
      mobileNo: '0987654321',
      aadharNo: '2109-8765-4321',
      panNo: 'XYZAB1234C',
      bankName: 'ABC Bank',
      bankAccNo: '1234567890',
      gstNo: '34XYZAB5678G1Z3',
      karigarGroup: 'Group B',
      department: 'Dept 2'
    },
    {
      jobLeft: 'Yes',
      karigarName: 'Alice Johnson',
      contractorName: 'LMN Pvt Ltd',
      mobileNo: '1122334455',
      aadharNo: '3456-7890-1234',
      panNo: 'LMNOP6789Q',
      bankName: 'LMN Bank',
      bankAccNo: '5678901234',
      gstNo: '56LMNOP7890H4Z5',
      karigarGroup: 'Group C',
      department: 'Dept 3'
    },
    {
      jobLeft: 'No',
      karigarName: 'Bob Brown',
      contractorName: 'DEF Enterprises',
      mobileNo: '5566778899',
      aadharNo: '6789-0123-4567',
      panNo: 'DEFQR1234S',
      bankName: 'DEF Bank',
      bankAccNo: '2345678901',
      gstNo: '78DEFQR1234J6Z7',
      karigarGroup: 'Group D',
      department: 'Dept 4'
    }
  ];

  useEffect(() => {
    let filtered = rowData;
    
    if (jobLeft) {
      filtered = filtered.filter(row => row.jobLeft.toLowerCase().includes(jobLeft.toLowerCase()));
    }
    if (karigarGroup) {
      filtered = filtered.filter(row => row.karigarGroup.toLowerCase().includes(karigarGroup.toLowerCase()));
    }
    if (department) {
      filtered = filtered.filter(row => row.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (contractor) {
      filtered = filtered.filter(row => row.contractorName.toLowerCase().includes(contractor.toLowerCase()));
    }

    setFilteredData(filtered);
  }, [jobLeft, karigarGroup, department, contractor]);

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Work Master</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onClose();
                }}
                src={Cross}
                alt="Close Icon"
                className={styles.crossIcon}
              />
            </div>



            <div className={styles2.topContainer}>
            <div className={styles2.gateOutTopGrid}>
           
            <div className={styles2.colSpan2}>
            <div className={styles2.inputbox}>
                <select value={jobLeft} onChange={(e) => setJobLeft(e.target.value)} className={styles.basicInput}>
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <span>Job Left</span>
              </div>
              </div>
              <div className={styles2.colSpan2}>
              <div className={styles2.inputbox}>
                <input
                className={styles.basicInput}
                  type="text"
                  value={karigarGroup}
                  onChange={(e) => setKarigarGroup(e.target.value)}
                  placeholder="Type or select group"
                  list="karigarGroups"
                />
                <datalist id="karigarGroups">
                  <option value="Group A" />
                  <option value="Group B" />
                  <option value="Group C" />
                  <option value="Group D" />
                </datalist>
                <span>Karigar Group</span>
              </div>
              </div>
              <div className={styles2.colSpan2}>
              <div className={styles2.inputbox}>
              
                <input
                className={styles.basicInput}
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Type or select department"
                  list="departments"
                />
                <datalist id="departments">
                  <option value="Dept 1" />
                  <option value="Dept 2" />
                  <option value="Dept 3" />
                  <option value="Dept 4" />
                </datalist>
                <span>Department</span>
              </div>
              </div>
              <div className={styles2.colSpan2}>
              <div className={styles2.inputbox}>
             
                <input
                className={styles.basicInput}
                  type="text"
                  value={contractor}
                  onChange={(e) => setContractor(e.target.value)}
                  placeholder="Type or select contractor"
                  list="contractors"
                />
                <datalist id="contractors">
                  <option value="ABC Corp" />
                  <option value="XYZ Ltd" />
                  <option value="LMN Pvt Ltd" />
                  <option value="DEF Enterprises" />
                </datalist>
                <span>Contractor</span>
              </div>
          
              </div>
            </div>
            </div>
            <div>
              <AutoTable
                tableHeight='500px'
                setIsEditing={setIsEditing}
                setEditIndex={setEditIndex}
                setFormData={setFormData}
                data={filteredData}
                canEdit={true}
                columns={columns}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default WorkMasterViewPopup;
