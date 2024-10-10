import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import styles2 from "../styles/inputDetails.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4
import BlankImage from "../assets/no-photo.png";
const ArticleActivity = () => {
  const [formData, setFormData] = useState({
    article: "",
    activity: "",
    department: "",
    serial: "",
    rate: "",
    rateOut: "",
    incentive: "",
    comm: "",
    commOutside: "",
    stdRate: "",
    conveyance: "",
    hide: 0,
    remark: "",
  });

  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      hide: prevData.hide === 1 ? 0 : 1, // Toggle between 0 and 1
    }));
  };
  // Handle Add/Edit item in grid
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

    // Reset form fields
    setFormData({
      article: "",
      activity: "",
      department: "",
      serial: "",
      rate: "",
      rateOut: "",
      incentive: "",
      comm: "",
      commOutside: "",
      stdRate: "",
      conveyance: "",
      remark: "",
      hide: 0, // Reset hide field
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      article: "",
      activity: "",
      department: "",
      serial: "",
      rate: "",
      rateOut: "",
      incentive: "",
      comm: "",
      commOutside: "",
      stdRate: "",
      conveyance: "",
      remark: "",
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
    { headerName: "Article", field: "article", sortable: true, filter: true },
    {
      headerName: "Activity",
      field: "activity",
      sortable: true,
      filter: true,
      cellRenderer: (params) => {
        const activityText = params.value || "";
        const hideStatus = params.data.hide === 1; // Check if hide is 1
        const tickSymbol = hideStatus ? "✅" : ""; // Use a checkmark symbol
        return `${activityText} ${tickSymbol}`; // Add tick next to activity
      },
    },
    {
      headerName: "Department",
      field: "department",
      sortable: true,
      filter: true,
    },
    { headerName: "Serial", field: "serial", sortable: true, filter: true },
    { headerName: "Rate", field: "rate", sortable: true, filter: true },
    {
      headerName: "Rate (Out-Side)",
      field: "rateOut",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Incentive %",
      field: "incentive",
      sortable: true,
      filter: true,
    },
    { headerName: "Comm", field: "comm", sortable: true, filter: true },
    {
      headerName: "Comm (Out-Side)",
      field: "commOutside",
      sortable: true,
      filter: true,
    },
    { headerName: "STD Rate", field: "stdRate", sortable: true, filter: true },
    {
      headerName: "Conveyance/Oth. Rate",
      field: "conveyance",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Hide",
      field: "hide",
      sortable: true,
      filter: true,
      valueFormatter: (params) => (params.value === 1 ? "Yes" : "No"),
    },
    { headerName: "Remark", field: "remark", sortable: true, filter: true },
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Article Activity</h1>
          <div className={styles2.headInputContainer}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <label className={styles2.inputLabel} htmlFor="Copyfrom">
                Copy from
              </label>
              <div className={styles2.headInputWithIcon}>
                <input
                  type="text"
                  name="input1"
                  placeholder="Search Activity"
                  className={styles2.headInput}
                  readOnly
                />
                <button
                  // onClick={() => {
                  //   setIsSampleDirPopup(true);
                  // }}
                  className={styles2.searchBtn}
                  aria-label="Search"
                ></button>
              </div>
            </div>

            <button
              className={styles.viewDataButton}
              style={{ marginLeft: "10px" }}
            >
              View Data
            </button>
          </div>
        </div>

        <div className={styles.topContainer}>
          <div className={styles.articleActivityGrid}>
            {/* First Column */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select
                  name="article"
                  value={formData.article}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Article</option>
                  <option value="Article 1">Article 1</option>
                  <option value="Article 2">Article 2</option>
                </select>
                <span>Article</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="activity"
                  value={formData.activity}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Activity</option>
                  <option value="Activity 1">Activity 1</option>
                  <option value="Activity 2">Activity 2</option>
                </select>
                <span>Activity</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Department</option>
                  <option value="Department 1">Department 1</option>
                  <option value="Department 2">Department 2</option>
                </select>
                <span>Department</span>
              </div>
            </div>

            {/* Second Column */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="serial"
                  value={formData.serial}
                  onChange={handleInputChange}
                  required
                />
                <span>Serial</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
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
            </div>

            <div className={styles2.imgColSpan}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className={styles2.fileinputcontainer2}>
                    {imagePreview ? (
                      <div className={styles2.imagepreview2}>
                        <img
                          src={imagePreview}
                        //  onClick={() => setIsImagePopup(true)}
                          alt="Preview"
                        />
                        <img
                          onClick={() => {
                            // setImagePreview(null);
                            // setImageFile(null);
                          }}
                          src={Cross}
                          alt="Select Icon"
                          className={styles2.removeImageButton2}
                        />
                      </div>
                    ) : (
                      <label htmlFor="file" className={styles2.filelabel2}>
                        <img
                         src={BlankImage}
                          alt="Image Placeholder"
                          className={styles2.uploadImagePlaceholder}
                        />
                        Article Image
                        <input
                          type="file"
                          id="file"
                          accept="image/*"
                         // onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
              </div>
              </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="rateOut"
                  value={formData.rateOut}
                  onChange={handleInputChange}
                  required
                />
                <span>Rate (Out-Side)</span>
              </div>
            </div>

            {/* Third Column */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="incentive"
                  value={formData.incentive}
                  onChange={handleInputChange}
                  required
                />
                <span>Incentive %</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="comm"
                  value={formData.comm}
                  onChange={handleInputChange}
                  required
                />
                <span>Comm</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="commOutside"
                  value={formData.commOutside}
                  onChange={handleInputChange}
                  required
                />
                <span>Comm (Out-Side)</span>
              </div>
            </div>

            {/* Fourth Column */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="stdRate"
                  value={formData.stdRate}
                  onChange={handleInputChange}
                  required
                />
                <span>STD Rate</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="conveyance"
                  value={formData.conveyance}
                  onChange={handleInputChange}
                  required
                />
                <span>Conveyance Rate</span>
              </div>
            </div>

            <div
              className={styles.colSpan}
              style={{ width: "137px", marginLeft: "6px" }}
            >
              <div className={styles.orderInTopGrid2}>
                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="sizeRequired"
                      checked={formData.hide === 1}
                      onChange={handleCheckboxChange}
                      className={styles.customCheckbox}
                    />
                    Hide
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  required
                />
                <span>Remark</span>
              </div>
            </div>


            {/* Add/Edit button */}
            <div className={styles.colSpan}>
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
              gridHeight="380px"
              editEnabled={true}
              pagination={true}
              deleteEnabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleActivity;
