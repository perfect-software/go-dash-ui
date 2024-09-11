import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/popupTable.module.css";
import styles2 from "../styles/newPo.module.css";
import Cross from "../assets/cross.svg";
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";

const WorkMasterViewPopup = ({ onClose, setFormData ,  setIsEditing}) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isPopup, setIsPopup] = useState(true);
  const [karigarGroup, setKarigarGroup] = useState("");
  const [department, setDepartment] = useState("");
  const [contractor, setContractor] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    {
      headerName: 'Select',
      field: 'select',
      width: 110,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    { headerName: 'Job Left', field: 'jobLeft', width: 100 },
    { headerName: 'Karigar Name', field: 'karigarName', width: 150 },
    { headerName: 'Contractor Name', field: 'contractorName', width: 150 },
    { headerName: 'Mobile No.', field: 'mobileNo', width: 130 },
    { headerName: 'Aadhar No.', field: 'aadharNo', width: 150 },
    { headerName: 'PAN No.', field: 'panNo', width: 150 },
    { headerName: 'Bank Name', field: 'bankName', width: 150 },
    { headerName: 'Bank A/C No.', field: 'bankAccNo', width: 150 },
    { headerName: 'GST No.', field: 'gstNo', width: 150 },
    { headerName: 'Karigar Group', field: 'karigarGroup', width: 150 },
    { headerName: 'Department', field: 'department', width: 150 },
  ];
  
  
  

  const rowData = [
    {
      id: 1,
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
      id: 2,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 3,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 4,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 5,
      jobLeft: 'Yes',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
    {
      id: 6,
      jobLeft: 'No',
      karigarName: 'Shivam Doe',
      contractorName: 'ABC Corp',
      mobileNo: '1234567890',
      aadharNo: '1234-5678-9012',
      panNo: 'ABCDE1234F',
      bankName: 'XYZ Bank',
      bankAccNo: '9876543210',
      gstNo: '12ABCDE3456F1Z2',
      karigarGroup: 'Group B',
      department: 'Dept 1'
    },
 
  ];
  

  useEffect(() => {
    let filtered = rowData;
  
    // Filter by date range if both dates are selected
    if (startDate && endDate) {
      filtered = filtered.filter(row => {
        const date = new Date(row.date); // 'date' field from the row
        return date >= startDate && date <= endDate;
      });
    }
  
    if (karigarGroup) {
      filtered = filtered.filter(row => row.karigarGroup.toLowerCase().includes(karigarGroup.toLowerCase()));
    }
    if (department) {
      filtered = filtered.filter(row => row.department && row.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (contractor) {
      filtered = filtered.filter(row => row.contractorName.toLowerCase().includes(contractor.toLowerCase()));
    }
  
    setFilteredData(filtered);
  }, [startDate, endDate, karigarGroup, department, contractor]);
  

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
                <div className={styles2.colSpan}>
                  <div className={styles2.inputbox}>
                    <DatePicker
                      selected={startDate}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                      }}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      isClearable
                      placeholderText="Select date range"
                      className={styles.basicInput}
                      style={{ width: '200px' }}
                    />
                    <span>Date Range</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
            <CustomAgGrid
                gridHeight="500px"
                rowData={filteredData&&filteredData}
                columnDefs={columns}
                setIsEditing={setIsEditing}
                setFormData={setFormData}
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default WorkMasterViewPopup;
