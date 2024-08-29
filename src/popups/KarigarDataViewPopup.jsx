import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import inputStyles from "../styles/inputDetails.module.css";
import { useNavigate } from "react-router-dom";
import { formatDate, formatDDMMYYYYDate } from "../features/convertDate";
import styles from "../styles/popupTable.module.css";
import Cross from "../assets/cross.svg";
import { ARTICLE_IMAGE_PATH } from "../features/url";
import { getApiService, getDataApiService } from "../service/apiService";
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";
const KarigarDataViewPopup = ({ onCancel,articleMstId ,onSubmitArticleData }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const columns = [
    { headerName: "Date", field: "date", width: 140 },
    { headerName: "Group", field: "group", width: 140 },
    { headerName: "Department", field: "department", width: 140 },
    { headerName: "Karigar Name", field: "karigarName", width: 140 },
    { headerName: "Article No.", field: "articleNo", width: 140 },
    { headerName: "Work Order No.", field: "workOrderNo", width: 140 },
    { headerName: "Activity Name", field: "activityName", width: 140 },
    { headerName: "Sample Request No.", field: "sampleRequestNo", width: 140 },
    { headerName: "Repair Slip No.", field: "repairSlipNo", width: 140 },
    { headerName: "Remark", field: "remark", width: 140 },
    { headerName: "Qty", field: "qty", width: 140 },
    { headerName: "Rate", field: "rate", width: 140 }
  ];
  
  const rowData = [
    {
      date: '2024-06-01',
      group: 'Group A',
      department: 'Dept 1',
      karigarName: 'John Doe',
      articleNo: '12345',
      workOrderNo: 'WO001',
      activityName: 'Activity 1',
      sampleRequestNo: 'SR001',
      repairSlipNo: 'RS001',
      remark: 'Remark 1',
      qty: '100',
      rate: '10.5'
    },
    {
      date: '2024-06-02',
      group: 'Group B',
      department: 'Dept 2',
      karigarName: 'Jane Smith',
      articleNo: '12346',
      workOrderNo: 'WO002',
      activityName: 'Activity 2',
      sampleRequestNo: 'SR002',
      repairSlipNo: 'RS002',
      remark: 'Remark 2',
      qty: '200',
      rate: '12.5'
    },
    {
      date: '2024-06-03',
      group: 'Group C',
      department: 'Dept 3',
      karigarName: 'Alice Johnson',
      articleNo: '12347',
      workOrderNo: 'WO003',
      activityName: 'Activity 3',
      sampleRequestNo: 'SR003',
      repairSlipNo: 'RS003',
      remark: 'Remark 3',
      qty: '300',
      rate: '15.5'
    },
    {
      date: '2024-06-04',
      group: 'Group D',
      department: 'Dept 4',
      karigarName: 'Bob Brown',
      articleNo: '12348',
      workOrderNo: 'WO004',
      activityName: 'Activity 4',
      sampleRequestNo: 'SR004',
      repairSlipNo: 'RS004',
      remark: 'Remark 4',
      qty: '400',
      rate: '18.5'
    }
  ];

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Karigar Data</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Select Icon"
                className={styles.crossIcon}
              />
            </div>


            <div >
            <CustomAgGrid
                gridHeight="500px"
                rowData={rowData}
                columnDefs={columns}
                editEnabled={false}
                deleteEnabled={false}
                pagination={true}
              />
  </div>
       
   
            </div>
      </div>
      </div>  
    )
  );
};

export default KarigarDataViewPopup;
