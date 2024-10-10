import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../styles/popupTable.module.css";
import styles2 from "../styles/newPo.module.css";
import Cross from "../assets/cross.svg";
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";

const ReinspectionView = ({ onCancel, setFormData, setIsEditing }) => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [season, setSeason] = useState("");
  const [department, setDepartment] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [defectType, setDefectType] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const columns = [
    { headerName: "Buyer Name", field: "buyerName" },
    { headerName: "Work Order", field: "workOrder" },
    { headerName: "Order Qty", field: "orderQty" },
    { headerName: "Inspected Qty", field: "inspectedQty" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Defect Name", field: "defectName" }
  ];

  const rowData = [
    {
      buyerName: 'ABC Corp',
      workOrder: 'WO123',
      orderQty: '1000',
      inspectedQty: '800',
      qty: '200',
      defectName: 'Color Variation'
    },
    {
      buyerName: 'XYZ Ltd',
      workOrder: 'WO456',
      orderQty: '1500',
      inspectedQty: '1400',
      qty: '100',
      defectName: 'Stitching Issues'
    },
    {
      buyerName: 'LMN Pvt Ltd',
      workOrder: 'WO789',
      orderQty: '2000',
      inspectedQty: '1800',
      qty: '200',
      defectName: 'Size Difference'
    }
  ];

  useEffect(() => {
    let filtered = rowData;

    if (startDate && endDate) {
      filtered = filtered.filter(row => {
        const date = new Date(row.date); // Assuming row.date exists in your rowData
        return date >= startDate && date <= endDate;
      });
    }

    if (season) {
      filtered = filtered.filter(row => row.season && row.season.toLowerCase().includes(season.toLowerCase()));
    }
    if (department) {
      filtered = filtered.filter(row => row.department && row.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (buyerName) {
      filtered = filtered.filter(row => row.buyerName.toLowerCase().includes(buyerName.toLowerCase()));
    }
    if (workOrder) {
      filtered = filtered.filter(row => row.workOrder.toLowerCase().includes(workOrder.toLowerCase()));
    }
    if (defectType) {
      filtered = filtered.filter(row => row.defectName.toLowerCase().includes(defectType.toLowerCase()));
    }

    setFilteredData(filtered);
  }, [startDate, endDate, season, department, buyerName, workOrder, defectType]);

  return (
    isPopupVisible && (
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainer}>
          <div className={styles.topPopupContainer}>
            <div className={styles.topBarContainer}>
              <h1>Re-Inspection Data</h1>
              <img
                onClick={() => {
                  setIsPopupVisible(false);
                  onCancel();
                }}
                src={Cross}
                alt="Close Icon"
                className={styles.crossIcon}
              />
            </div>

            <div className={styles2.topContainer}>
              <div className={styles2.gateOutTopGrid}>

                {/* Season */}
                <div className={styles2.colSpan}>
                  <div className={styles2.inputbox}>
                    <input
                      className={styles.basicInput}
                      type="text"
                      value={season}
                      onChange={(e) => setSeason(e.target.value)}
                      placeholder="Type or select season"
                    />
                    <span>Season</span>
                  </div>
                </div>

                {/* Date Range */}
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
                      placeholderText="Select Range"
                      className={styles.basicInput}
                      style={{ width: '400px' }}
                    />
                    <span>Date Range</span>
                  </div>
                </div>

                {/* Department */}
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

                {/* Buyer Name */}
                <div className={styles2.colSpan2}>
                  <div className={styles2.inputbox}>
                    <input
                      className={styles.basicInput}
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Type or select buyer"
                    />
                    <span>Buyer Name</span>
                  </div>
                </div>

                {/* Work Order */}
                <div className={styles2.colSpan}>
                  <div className={styles2.inputbox}>
                    <input
                      className={styles.basicInput}
                      type="text"
                      value={workOrder}
                      onChange={(e) => setWorkOrder(e.target.value)}
                      placeholder="Type or select work order"
                    />
                    <span>Work Order</span>
                  </div>
                </div>

                {/* Defect Type */}
                <div className={styles2.colSpan}>
                  <div className={styles2.inputbox}>
                    <input
                      className={styles.basicInput}
                      type="text"
                      value={defectType}
                      onChange={(e) => setDefectType(e.target.value)}
                      placeholder="Type or select defect type"
                    />
                    <span>Defect Type</span>
                  </div>
                </div>

              </div>
            </div>
            <div>
              <CustomAgGrid
                gridHeight="500px"
                rowData={filteredData && filteredData}
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


export default ReinspectionView;
