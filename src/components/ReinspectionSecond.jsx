import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AutoTable from "../features/AutoTable";
import { useSidebar } from "../context/SidebarContext";
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import CustomAgGrid from "../features/CustomAgGrid";
import ReinspectionView from "../popups/ReinspectionView";

const ItemDetails = () => {
  const [formData, setFormData] = useState({
    defect: "",
    pairQty: "",
  });

  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = itemGridData.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
      setItemGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setItemGridData([...itemGridData, { id: uuidv4(), ...formData }]);
    }
    setFormData({
      id: "",
      defect: "",
      pairQty: "",
    });
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      id: "",
      defect: "",
      pairQty: "",
    });
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    // { headerName: "ID", field: "id", sortable: true, filter: true, width: 200 }, // Display the ID column
    {
      headerName: "Defect Type",
      field: "defect",
      sortable: true,
      filter: true,
      width: 400,
    },
    {
      headerName: "Defect Qty",
      field: "pairQty",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className={styles.dmtrparentOthersDiv}>
      <div className={styles.leftkarigarItemDiv} style={{ width: "100%" }}>
        <div className={styles.itemNameKarigarInputDiv2}>
          <div className={styles.inputbox} style={{width:'15%'}}>
            <input
              type="text"
              className={styles.basicInput}
              name="defect"
              value={formData.defect}
              onChange={handleInputChange}
              required
            />
            <span>Defect Qty</span>
          </div>
          <div className={styles.inputbox} style={{width:'35%'}}>
            <select
              className={styles.basicInput}
              name="defectType"
              value={formData.defectType}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Defect Type
              </option>
              <option value="Color Variation">Color Variation</option>
              <option value="Stitching Issues">Stitching Issues</option>
              <option value="Size Difference">Size Difference</option>
              <option value="Fabric Tear">Fabric Tear</option>
              <option value="Missing Label">Missing Label</option>
              {/* Add more defect types as needed */}
            </select>
            <span>Defect Type</span>
          </div>

          <div >
            <button
              onClick={handleAddItem}
              className={styles.button50}
              aria-label="Add"
            >
              <span className={styles.button50__Content}>
                <span className={styles.button50__Text}>
                  {isEditing ? "Edit" : "Add to Grid"}
                </span>
              </span>
            </button>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className={styles.button50}
                aria-label="Cancel"
              >
                <span className={styles.button50__Content}>
                  <span className={styles.button50__Text}>Cancel</span>
                </span>
              </button>
            )}
          </div>
        </div>
        <div>
          <CustomAgGrid
            rowData={itemGridData}
            setIsEditing={setIsEditing}
            setRowData={setItemGridData}
            columnDefs={columnDefs}
            setFormData={setFormData}
            gridHeight="350px"
            editEnabled={true}
            pagination={true}
            deleteEnabled={true}
          />
        </div>
      </div>
    </div>
  );
};

const Reinspection = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formattedDate, setFormattedDate] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString(), // Current date, auto-filled
    department: "", // User-selected
    workOrder: "", // Auto-filled
    buyerName: "", // Auto-filled
    articleNo: "", // Auto-filled
    color: "", // Auto-filled
    orderQty: "", // Auto-filled
    qcBy: "", // User-selected
    inspectQty: "100", // Auto-filled, or set this value as needed
  });

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];
    setFormattedDate(currentDate);
  }, []);
  const columns = {
    departmentName: { label: "Department Name", width: "300px" },
    articleNo: { label: "Article No", width: isCollapsed ? "200px" : "170px" },
    workOrder: { label: "Work Order", width: isCollapsed ? "285px" : "250px" },
    qcName: { label: "QC Name", width: isCollapsed ? "200px" : "170px" },
    remark: { label: "Remark", width: isCollapsed ? "240px" : "200px" },
  };

  const [isViewData, setViewDataPopup] = useState(false);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Re-Inspection</h1>
          <button
            className={styles.viewDataButton}
            onClick={() => setViewDataPopup(true)}
          >
            View Data
          </button>
        </div>

        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            {/* Date (auto-filled with current date) */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="date"
                  value={new Date().toLocaleDateString()} // Automatically fill with current date
                  disabled
                  className={styles.basicInput}
                />
                <span>DATE</span>
              </div>
            </div>

            {/* Department (select option) */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Department</option>
                  <option value="Dept1">Department 1</option>
                  <option value="Dept2">Department 2</option>
                  <option value="Dept3">Department 3</option>
                </select>
                <span>DEPARTMENT</span>
              </div>
            </div>

            {/* Work Order (auto-filled) */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="workOrder"
                  value={formData.workOrder}
                  disabled
                  className={styles.basicInput}
                />
                <span>WORK ORDER</span>
              </div>
            </div>

            {/* Buyer Name (auto-filled) */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="buyerName"
                  value={formData.buyerName}
                  disabled
                  className={styles.basicInput}
                />
                <span>BUYER NAME</span>
              </div>
            </div>

            {/* Article No (auto-filled) */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="articleNo"
                  value={formData.articleNo}
                  disabled
                  className={styles.basicInput}
                />
                <span>ARTICLE NO</span>
              </div>
            </div>

            {/* Color (auto-filled) */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  disabled
                  className={styles.basicInput}
                />
                <span>COLOR</span>
              </div>
            </div>

            {/* Order Qty (auto-filled) */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="orderQty"
                  value={formData.orderQty}
                  disabled
                  className={styles.basicInput}
                />
                <span>ORDER QTY</span>
              </div>
            </div>
      {/* Inspect Qty (auto-filled) */}
      <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  name="inspectQty"
                  value={formData.inspectQty}
                  disabled
                  className={styles.basicInput}
                />
                <span>INSPECT QTY</span>
              </div>
            </div>
            {/* QC By (select option) */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="qcBy"
                  value={formData.qcBy}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select QC</option>
                  <option value="QC1">QC 1</option>
                  <option value="QC2">QC 2</option>
                  <option value="QC3">QC 3</option>
                </select>
                <span>QC BY</span>
              </div>
            </div>

      
          </div>
        </div>

        <div
          className={styles.headBorder}
          style={{ marginLeft: "10px", marginRight: "10px" }}
        ></div>

        <ItemDetails />
      </div>
      {isViewData && (
        <ReinspectionView
          onCancel={() => {
            setViewDataPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default Reinspection;
