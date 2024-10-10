import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/popupTable.module.css";
import styles2 from "../styles/newPo.module.css";
import Cross from "../assets/cross.svg";
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";

const AllowRateDiffPopup = ({ onClose, setFormData ,  setIsEditing}) => {
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
    { headerName: 'Date', field: 'date', sortable: true, filter: true },
    { headerName: 'Plan No.', field: 'planNo', sortable: true, filter: true },
    { headerName: 'Code', field: 'code', sortable: true, filter: true },
    { headerName: 'Activity', field: 'activity', sortable: true, filter: true },
    { headerName: 'Qty', field: 'qty', sortable: true, filter: true },
    { headerName: 'Rate', field: 'rate', sortable: true, filter: true },
    { headerName: 'Base Activity', field: 'baseActivity', sortable: true, filter: true },
    { headerName: 'Article', field: 'article', sortable: true, filter: true },
    { headerName: 'Remark', field: 'remark', sortable: true, filter: true },
  ];
  
  

  const rowData = [
    {
      date: '24-09-2024',
      planNo: 'PLN-01',
      code: 'ABC123',
      activity: 'CLOSING',
      qty: 100,
      rate: 50,
      baseActivity: 'CUTTING',
      article: 'ART-001',
      remark: 'Completed',
    },
    {
      date: '25-09-2024',
      planNo: 'PLN-02',
      code: 'XYZ789',
      activity: 'PACKING',
      qty: 200,
      rate: 75,
      baseActivity: 'SEWING',
      article: 'ART-002',
      remark: 'In progress',
    },
    {
      date: '26-09-2024',
      planNo: 'PLN-03',
      code: 'LMN456',
      activity: 'ASSEMBLY',
      qty: 150,
      rate: 65,
      baseActivity: 'FINISHING',
      article: 'ART-003',
      remark: 'Pending',
    },
  ];
  


  

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Allow Rate DIff</h1>
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

      
            <div>
            <CustomAgGrid
                gridHeight="500px"
                rowData={rowData}
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

export default AllowRateDiffPopup;
