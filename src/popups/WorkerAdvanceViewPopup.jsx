import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/popupTable.module.css";
import styles2 from "../styles/newPo.module.css";
import Cross from "../assets/cross.svg";
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";

const WorkerAdvanceViewPopup = ({ onClose, setFormData ,  setIsEditing}) => {
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Karigar Group", field: "karigarGroup",  },
    { headerName: "Contractor Name", field: "contractorName",  },
    { headerName: "Karigar Name", field: "karigarName",  },
    { headerName: "Father Name", field: "fatherName",  },
    { headerName: "Loan Amt", field: "loanAmt",  },
    { headerName: "Advance Amt", field: "advanceAmt",  },
    { headerName: "Less Loan Amt", field: "lessLoanAmt",  },
    { headerName: "Less Advance Amt", field: "lessAdvanceAmt",  }
  ];
  
  

  const rowData = [
    {
      karigarGroup: 'Group D',
      contractorName: 'DEF Enterprises',
      karigarName: 'Bob Brown',
      fatherName: 'Brown Sr.',
      loanAmt: '7000',
      advanceAmt: '4000',
      lessLoanAmt: '2500',
      lessAdvanceAmt: '1800',
      date: '2024-08-01', 
    },
    {
      karigarGroup: 'Group C',
      contractorName: 'XYZ Ltd',
      karigarName: 'Alice Johnson',
      fatherName: 'Johnson Sr.',
      loanAmt: '8000',
      advanceAmt: '3000',
      lessLoanAmt: '2000',
      lessAdvanceAmt: '1000',
      date: '2024-08-05', 
    },
    {
      karigarGroup: 'Group A',
      contractorName: 'LMN Pvt Ltd',
      karigarName: 'Charlie Davis',
      fatherName: 'Davis Sr.',
      loanAmt: '6000',
      advanceAmt: '2000',
      lessLoanAmt: '1500',
      lessAdvanceAmt: '1200',
      date: '2024-08-10', 
    },
    {
      karigarGroup: 'Group B',
      contractorName: 'ABC Corp',
      karigarName: 'Diana White',
      fatherName: 'White Sr.',
      loanAmt: '9000',
      advanceAmt: '5000',
      lessLoanAmt: '3500',
      lessAdvanceAmt: '2700',
      date: '2024-08-15', 
    },
    {
      karigarGroup: 'Group E',
      contractorName: 'PQR Industries',
      karigarName: 'Edward Green',
      fatherName: 'Green Sr.',
      loanAmt: '7500',
      advanceAmt: '3500',
      lessLoanAmt: '2800',
      lessAdvanceAmt: '2100',
      date: '2024-08-20', 
    }
  ];
  

  useEffect(() => {
    let filtered = rowData;
  
    
    if (startDate && endDate) {
      filtered = filtered.filter(row => {
        const date = new Date(row.date); 
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

export default WorkerAdvanceViewPopup;
