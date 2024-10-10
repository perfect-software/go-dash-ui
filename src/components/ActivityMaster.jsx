import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import { forEach } from "rsuite/esm/internals/utils/ReactChildren";
import ArticleActivityDataViewPopup from "../popups/ArticleActivityDataViewPopup";

const ItemDetails = () => {

  const [formData, setFormData] = useState({
    karigarName: "",
  });

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleToggleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = data.map(item =>
        item.id === formData.id ? { ...formData } : item
      );
      setData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setData([...data, { id: uuidv4(), ...formData }]);
    }
    setFormData({
      id: '',
      karigarName: "",
    });
  };

 

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      karigarName: "",
     
    
    });
  };

  const sizeColumns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Head", field: "itemSubGroupHead", width: 250 },

  ];

  const itemColumns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Karigar Name", field: "karigarName", width: 250 },
  
   
  ];
  

  const [sizeGridData, setSizeGridData] = useState([]);
  const [sizeData, setSizeData] = useState({
    itemSubGroupHead: "",
   
  });


  const handleAddSize = () => {
    setSizeGridData([...sizeGridData, { ...sizeData }]);
    setSizeData({
      itemSubGroupHead: "",
     
    });
  };
  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setSizeData({ ...sizeData, [name]: value });
  };
  return (
    <>
      <div className={styles.karigarTopContainer}>
        <div className={styles.leftFloorReturnItemDiv} style={{ width: "50%" }}>
          <div className={styles.inputLinerGrid}>
            <div className={styles.colSpanInputLiner}>
              <div className={styles.materialIssueDetailsInput}>
                <div
                  className={styles.inputboxScroll}
                  style={{ width: "300px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="karigarName"
                    value={formData.karigarName}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Karigar Name</span>
                </div>
              

                <div className={styles.colSpan2}>
              <button
                onClick={handleAddItem}
                className={styles.button50}
                aria-label="Add"
              
              >
                <span className={styles.button50__Content}>
                  <span className={styles.button50__Text}>{isEditing ? "Edit" : "Add"}</span>
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
          <CustomAgGrid
            gridHeight="330px"
                rowData={data}
                setIsEditing={setIsEditing}
                setRowData={setData}
                columnDefs={itemColumns}
                setFormData={setFormData}
                editEnabled={false}
                deleteEnabled={true}
                pagination={true}
              />
        </div>

        <div className={styles.rightkarigarItemDiv} style={{ width: "50%" }}>
          <div className={styles.floorSizeInputDiv}>
            <div className={styles.inputboxScroll} style={{ width: "300px" }}>
              <input
                type="text"
                className={styles.basicInput}
                name="itemSubGroupHead"
                value={sizeData.itemSubGroupHead}
                onChange={handleSizeInputChange}
                required
              />
              <span>Item Sub Group Head</span>
            </div>
    
            <button
              onClick={handleAddSize}
              className={styles.button50}
              aria-label="Add"
            >
              <span className={styles.button50__Content}>
                <span className={styles.button50__Text}>Add</span>
              </span>
            </button>
          </div>
          <div>
            <CustomAgGrid
                gridHeight="330px"
                rowData={sizeGridData}
                setRowData={setSizeGridData}
                columnDefs={sizeColumns}
                editEnabled={false}
                deleteEnabled={true}
                pagination={true}
              />
          </div>
        </div>
      </div>
    </>
  );
};

const ActivityMaster = () => {
  const { isCollapsed } = useSidebar();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formData, setFormData] = useState({
    department: "",
    activity: "",
    remark: "",
    itemReq:"",
    hide: 0,
    pipeline: 0,
    extraAllow: 0,
    notActivity: 0,
    incentive: "",
    groupHeader: "",
    rate: "",
  });

  // Handle input changes for text and select fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const [isViewData, setViewDataPopup] = useState(false);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Activity Master</h1>
          <button
            className={styles.viewDataButton}
            style={{ marginLeft: "10px" }}
            onClick={() => setViewDataPopup(true)}
          >
            View Data
          </button>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.articleActivityGrid}>
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
                <span>Activity Name</span>
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
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  required
                />
                <span>Rate</span>
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

            {/* Hide Checkbox */}
            <div
              className={styles.colSpan3}
              style={{gap:'5px'}}
            >
              <div className={styles.orderInTopGrid2}>
                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="hide"
                      checked={formData.hide === 1}
                      onChange={handleInputChange}
                      className={styles.customCheckbox}
                    />
                    Hide
                  </label>
                </div>
              </div>
           

            {/* Not An Activity Checkbox */}
           
            
              <div className={styles.orderInTopGrid2}>
                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="notActivity"
                      checked={formData.notActivity === 1}
                      onChange={handleInputChange}
                      className={styles.customCheckbox}
                    />
                    Not An Activity
                  </label>
                </div>
              </div>
              <div className={styles.orderInTopGrid2}>
                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="extraAllow"
                      checked={formData.extraAllow === 1}
                      onChange={handleInputChange}
                      className={styles.customCheckbox}
                    />
                    Extra Allow
                  </label>
                </div>
              </div>

           
              <div className={styles.orderInTopGrid2}>
                <div className={styles.inputbox}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="pipeline"
                      checked={formData.pipeline === 1}
                      onChange={handleInputChange}
                      className={styles.customCheckbox}
                    />
                    Pipeline
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="groupHeader"
                  disabled={formData.pipeline === 0} // Disable if pipeline is unchecked
                  value={formData.groupHeader}
                  onChange={handleInputChange}
                  required
                />
                <span>Group Header (Pipeline)</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <select
                  name="itemReq"
                  value={formData.itemReq}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
               
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <span>Item Required</span>
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
        <ArticleActivityDataViewPopup
          onCancel={() => {
            setViewDataPopup(false);
          }}
        />
      )}
    </div>
  );
};


export default ActivityMaster;
