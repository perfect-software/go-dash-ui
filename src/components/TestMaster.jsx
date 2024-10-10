import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4

const TestMaster = () => {
  const [formData, setFormData] = useState({
    testType: "",
    materialType: "",
    testParameters: "",
    testMethod: "",
    testName: "",
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
      const updatedGridData = itemGridData.map((item) =>
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
      testType: "",
      materialType: "",
      testParameters: "",
      testMethod: "",
      testName: "",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      testType: "",
      materialType: "",
      testParameters: "",
      testMethod: "",
      testName: "",
    });
  };

  // Grid column definitions
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    {
      headerName: "Test Type",
      field: "testType",
      sortable: true,
      filter: true,
      width: 250,
    },
    {
      headerName: "Material Type",
      field: "materialType",
      sortable: true,
      filter: true,
      width: 250,
    },
    {
      headerName: "Test Parameters",
      field: "testParameters",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Test Method",
      field: "testMethod",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Test Name",
      field: "testName",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.headText}> Test Master</h1>
          <button className={styles.viewDataButton}>View Data</button>
        </div>

      
          <div className={styles.topContainer}>
            <div className={styles.gateOutTopGrid}>
              {/* TEST TYPE (Combo Box) */}
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <select
                    name="testType"
                    value={formData.testType}
                    onChange={handleInputChange}
                    className={styles.basicInput}
                  >
                    <option value="">Select Test Type</option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                  </select>
                  <span>TEST TYPE</span>
                </div>
              </div>

              {/* MATERIAL TYPE (Combo Box) */}
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <select
                    name="materialType"
                    value={formData.materialType}
                    onChange={handleInputChange}
                    className={styles.basicInput}
                  >
                    <option value="">Select Material Type</option>
                    <option value="Material 1">Material 1</option>
                    <option value="Material 2">Material 2</option>
                  </select>
                  <span>MATERIAL TYPE</span>
                </div>
              </div>

              {/* TEST PARAMETERS (Text Input) */}
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="testParameters"
                    value={formData.testParameters}
                    onChange={handleInputChange}
                  />
                  <span>TEST PARAMETERS</span>
                </div>
              </div>

              {/* TEST METHOD (Text Input) */}
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="testMethod"
                    value={formData.testMethod}
                    onChange={handleInputChange}
                  />
                  <span>TEST METHOD</span>
                </div>
              </div>

              {/* TEST NAME (Text Input) */}
              <div className={styles.colSpan2}>
                <div className={styles.inputbox}>
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="testName"
                    value={formData.testName}
                    onChange={handleInputChange}
                  />
                  <span>TEST NAME</span>
                </div>
              </div>

              <div className={styles.colSpan2}>
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
            </div>
          </div>

        <div style={{marginLeft:"10px",marginRight:'10px'}}>
        <CustomAgGrid
              rowData={itemGridData}
              setIsEditing={setIsEditing}
              setRowData={setItemGridData}
              columnDefs={columnDefs}
              setFormData={setFormData}
              gridHeight="420px"
              editEnabled={true}
              pagination={true}
              deleteEnabled={true}
            />
        </div>
          <div>
           
          </div>
     
      </div>
    </div>
  );
};

export default TestMaster;
