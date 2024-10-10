import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

const LabTest = () => {
  const [formData, setFormData] = useState({
    labName: '',
    testName: '',
    rate: '',
  });
  
  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Add/Edit item in grid
  const handleAddItem = () => {
    if (isEditing) {
      // Update existing row
      const updatedGridData = itemGridData.map(item =>
        item.id === formData.id ? { ...formData } : item
      );
      setItemGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add new row
      setItemGridData([...itemGridData, { id: uuidv4(), ...formData }]);
    }
    // Reset form fields
    setFormData({
      labName: '',
      testName: '',
      rate: '',
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      labName: '',
      testName: '',
      rate: '',
    });
  };

  // Grid column definitions
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: 'select',
      headerName: 'Select',
    },
    { headerName: "Lab Name", field: "labName", sortable: true, filter: true, width: 400 },
    { headerName: "Test Name", field: "testName", sortable: true, filter: true },
    { headerName: "Rate", field: "rate", sortable: true, filter: true },
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Lab Test</h1>
          <button className={styles.viewDataButton}>View Data</button>
        </div>

        <div className={styles.dmtrparentOthersDiv}>
          <div className={styles.leftkarigarItemDiv} style={{ width: '100%' }}>
            <div className={styles.itemNameKarigarInputDiv2}>
              {/* Test Name Input */}
              <div className={styles.inputbox} style={{ width: '35%' }}>
                <select
                  name="testName"
                  value={formData.testName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Test Name</option>
                  {/* Add more options dynamically */}
                  <option value="Test 1">Test 1</option>
                  <option value="Test 2">Test 2</option>
                </select>
                <span>TEST NAME</span>
              </div>

              {/* Lab Name Input */}
              <div className={styles.inputbox} style={{ width: '35%' }}>
                <select
                  name="labName"
                  value={formData.labName}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Lab Name</option>
                  {/* Add more options dynamically */}
                  <option value="Lab 1">Lab 1</option>
                  <option value="Lab 2">Lab 2</option>
                </select>
                <span>LAB NAME</span>
              </div>

              {/* Rate Input */}
              <div className={styles.inputbox} style={{ width: '15%' }}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  required
                />
                <span>Rate</span>
              </div>

              {/* Add/Edit button */}
              <div>
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

            {/* AG Grid Component */}
            <div>
              <CustomAgGrid
                rowData={itemGridData}
                setIsEditing={setIsEditing}
                setRowData={setItemGridData}
                columnDefs={columnDefs}
                setFormData={setFormData}
                gridHeight="450px"
                editEnabled={true}
                pagination={true}
                deleteEnabled={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTest;
