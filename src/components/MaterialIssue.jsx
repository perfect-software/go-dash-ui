import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { v4 as uuidv4 } from 'uuid';
import AutoTable from "../features/AutoTable";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import CustomAgGrid from "../features/CustomAgGrid";

const ItemDetails = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    unit: "",
    supplierName: "",
    suppInvNo: "",
    stdAverage: "",
    reqQty: "",
    itemQty: "",
    fromOpeningStock: "No",
    productionSample: "Prod",
    repair: false,
    extraIssue: "Repair",
    remark: "",
  });

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    console.log(
      "Selected Rows Data:",
      selectedRows.map((index) => data[index])
    );
  }, [selectedRows]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 
 
  const handleCheckboxChange = (name, checked) => {
    setFormData({ ...formData, [name]: checked });
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
      itemName: "",
      unit: "",
      supplierName: "",
      suppInvNo: "",
      stdAverage: "",
      reqQty: "",
      itemQty: "",
      fromOpeningStock: "No",
      productionSample: "Prod",
      repair: false,
      extraIssue: "Repair",
      remark: "",
    });
  };

  const CustomCellRenderer = (props) => {
    const { value } = props;
  
    const cellStyle = {
      backgroundColor: value === "Samp" ? "#f44336" : "#4caf50",
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      borderRadius: '10px',
      width: '100%',
      marginTop: '15%',
      height: '50%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center' 
    };
  
    return (
      <div style={cellStyle}>
        {value === "Samp" ? "Samp" : "Prod"}
      </div>
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      itemName: "",
      unit: "",
      supplierName: "",
      suppInvNo: "",
      stdAverage: "",
      reqQty: "",
      itemQty: "",
      fromOpeningStock: "No",
      productionSample: "Prod",
      repair: false,
      extraIssue: "Repair",
      remark: "",
    });
  };

  const itemColumns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "From Opening Stock", field: "fromOpeningStock", width: 70 },
    { headerName: "Item Name", field: "itemName", width: 150 },
    { headerName: "Unit", field: "unit", width: 80 },
    { headerName: "Supplier Name", field: "supplierName", width: 150 },
    { headerName: "Req Qty", field: "reqQty", width: 80 },
    { headerName: "Item Qty", field: "itemQty", width: 80 },
    { headerName: "Supp. Inv. No", field: "suppInvNo", width: 80 },
    { headerName: "Std. Average", field: "stdAverage", width: 80 },
    {
      headerName: "Caption",
      field: "productionSample",
      width: 100,
      cellRenderer: CustomCellRenderer, // Use the custom cell renderer here
    },
    { headerName: "Repair / Extra Issue", field: "extraIssue", width: 80 },
    { headerName: "Remark", field: "remark", width: 200 }
  ];
  

  return (
    
<>
        <div className={styles.karigarTopContainer}>
          <div className={styles.inputLinerGrid}>
            <div className={styles.colSpanInputLiner}>
              <div className={styles.materialIssueDetailsInput}>
                <div className={styles.inputboxScroll}>
                  <div className={styles.checkboxContainerIssue}>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.fromOpeningStock === "No"}
                        onChange={(e) =>
                          handleToggleChange(
                            "fromOpeningStock",
                            e.target.checked ? "No" : "Yes"
                          )
                        }
                      />
                      From Opening Stock
                    </label>
                  </div>
                </div>
                <div
                  className={styles.inputboxScroll}
                  style={{ width: "250px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Item Name</span>
                </div>
                <div
                  className={styles.inputboxScroll}
                  style={{ width: "250px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Supplier Name</span>
                </div>
                <div
                  className={styles.inputboxScroll}
                  style={{ width: "80px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Unit</span>
                </div>
  <div
                  className={styles.inputboxScroll}
                  style={{ width: "100px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="stdAverage"
                    value={formData.stdAverage}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Std. Average</span>
                </div>
      

              

                <div
                  className={styles.inputboxScroll}
                  style={{ width: "100px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="reqQty"
                    value={formData.reqQty}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Req Qty</span>
                </div>

                <div
                  className={styles.inputboxScroll}
                  style={{ width: "100px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="itemQty"
                    value={formData.itemQty}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Item Qty</span>
                </div>
          <div
                  className={styles.inputboxScroll}
                  style={{ width: "140px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="suppInvNo"
                    value={formData.suppInvNo}
                    onChange={handleInputChange}
                    disabled={formData.fromOpeningStock == "No"}
                    required
                  />
                  <span>Supp. Inv. No</span>
                </div>
                   <div
                  className={styles.inputboxScroll}
                  style={{ width: "250px" }}
                >
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

                <div
                  className={styles.switchContainer}
                  style={{ width: "100px" }}
                >
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      hidden
                      checked={formData.productionSample === "Samp"}
                      onChange={(e) =>
                        handleToggleChange(
                          "productionSample",
                          e.target.checked ? "Samp" : "Prod"
                        )
                      }
                    />
                    <div className={styles.switchWrapper}>
                      <div className={styles.switchToggle}>
                        {formData.productionSample === "Samp" ? "Samp" : "Prod"}
                      </div>
                    </div>
                  </label>
                </div>

                <div className={styles.inputboxScroll}>
                  <div className={styles.checkboxContainerIssue}  style={{ width: "70px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.repair}
                        onChange={(e) =>
                          handleCheckboxChange("repair", e.target.checked)
                        }
                      />
                      Repair
                  
                    </label>
                  </div>
                </div>
                {formData.repair && (
                  <div
                    className={styles.switchContainer}
                    style={{ width: "100px" }}
                  >
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        hidden
                        checked={formData.extraIssue === "Extra Issue"}
                        onChange={(e) =>
                          handleToggleChange(
                            "extraIssue",
                            e.target.checked ? "Extra Issue" : "Repair"
                          )
                        }
                      />
                      <div className={styles.switchWrapper}>
                        <div className={styles.switchToggle}>
                          {formData.extraIssue === "Extra Issue"
                            ? "Extra"
                            : "Repair"}
                        </div>
                      </div>
                    </label>
                  </div>
                )}

             
<div className={styles.colSpan2}>
              <button
                onClick={handleAddItem}
                className={styles.button50}
                aria-label="Add"
              >
                <span className={styles.button50__Content}>
                  <span className={styles.button50__Text}>
                    {isEditing ? "Edit" : "Add"}
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
          <div>
          </div>
        </div>
       <CustomAgGrid
                rowData={data}
                setIsEditing={setIsEditing}
                setRowData={setData}
                columnDefs={itemColumns}
                setFormData={setFormData}
                gridHeight="333px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
       
      
    </>
   
  );
};

const MaterialIssue = () => {
  const [formData2, setFormData2] = useState({
    date: "",
    group: "",
    department: "",
    karigarName: "",
    articleNo: "",
    workOrderNo: "",
    activityName: "",
    pairQty: "",
    sampleRequestNo: "",
    remark: "",
  });

  const columns = {
    date: { label: "Date", width: "150px" },
    group: { label: "Group", width: "212px" },

    karigarName: { label: "Karigar Name", width: "285px" },
    department: { label: "Department", width: "200px" },
     sampleRequestNo: { label: "Sample Request No.", width: "150px" },

    pairQty: { label: "Pair Qty", width: "100px" },
    articleNo: { label: "Article No.", width: "100px" },
     workOrderNo: { label: "Work Order No.", width: "150px" },
  
    activityName: { label: "Activity Name", width: "285px" },
    remark: { label: "Remark", width: "200px" },
   
    

 
  };
  const [sizeGridData, setSizeGridData] = useState([]);
  const [sizeData, setSizeData] = useState({
    size: '',
    qty: ''
  });
 
  const handleAddSize = () => {
    const existingIndex = sizeGridData.findIndex(item => item.size === sizeData.size);
    if (existingIndex === -1) {
      setSizeGridData([...sizeGridData, { ...sizeData }]);
    } else {
      const updatedGridData = sizeGridData.map((item, index) =>
        index === existingIndex ? { ...sizeData } : item
      );
      setSizeGridData(updatedGridData);
    }
    setSizeData({
      size: '',
      qty: ''
    });
  };
  const sizeColumns = [
    { headerName: "Size", field: "size", width: 150 },
    { headerName: "Qty", field: "qty", width: 150 }
  ];
  
  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setSizeData({ ...sizeData, [name]: value });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData2((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isViewData, setViewDataPopup] = useState(false);
  const toggleExpanded = (section) => {
    setExpandedState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const [expandedState, setExpandedState] = useState({
    details: false,
  });

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Material Issue</h1>
          <button
            className={styles.viewDataButton}
            onClick={() => setViewDataPopup(true)}
          >
            View Data
          </button>
        </div>
        <div className={styles.MiparentDiv}>
        <div className={styles.leftkarigarItemDiv} style={{ width: "75%" }}>
        <div className={styles.karigarTopContainer}>
          <div className={styles.inputLinerGrid}>
            <div className={styles.colSpanInputLiner}>
              <div className={styles.itemDetailsInput}>
                {Object.keys(columns).map((key, index) => (
                  <div key={index} className={styles.inputboxScroll}>
                    {key === "group" ||
                    key === "karigarName" ||
                    key === "activityName" ? (
                      <select
                        name={key}
                        className={styles.basicInput}
                        required
                        value={formData2[key]}
                        onChange={handleInputChange}
                        style={{ width: columns[key].width }}
                      >
                        <option value="">{columns[key].label}</option>
                        {key === "group" && (
                          <>
                            <option value="WORKER">WORKER</option>
                          </>
                        )}
                        {key === "karigarName" && (
                          <>
                            <option value="ADIL">ADIL</option>
                          </>
                        )}
                        {key === "activityName" && (
                          <>
                            <option value="SKIVING">SKIVING</option>
                          </>
                        )}
                      </select>
                    ) : (
                      <input
                        type={
                          key === "date"
                            ? "date"
                            : key === "qty" || key === "rate"
                            ? "number"
                            : "text"
                        }
                        name={key}
                        className={styles.basicInput}
                        required
                        value={formData2[key]}
                        onChange={handleInputChange}
                        style={{ width: columns[key].width }}
                      />
                    )}
                    <span>{columns[key].label}</span>
                  </div>
                ))}
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

        <div className={styles.rightkarigarItemDiv} style={{ width: "25%" }}>
        <div className={styles.materialIssueOthersDiv}>
          <div className={styles.karigarDetailsGridContainer}>
            <div>
              <p>Order Qty</p>
              <p>1243</p>
            </div>
            <div>
              <p>Order Qty Extra</p>
              <p>446</p>
            </div>
            <div>
              <p>Stock In Hand (As On Date) </p>
              <p>34343</p>
            </div>
            <div>
              <p>Current Stock</p>
              <p>34343</p>
            </div>
            <div>
              <p>Total Issue Pair in Activity</p>
              <p>3443</p>
            </div>
            <div>
              <p>Total Item Balance (BOM)</p>
              <p>3443</p>
            </div>
            <div>
              <p>Total Item Req In BOM</p>
              <p>3443</p>
            </div>
            <div>
              <p>Inv Balance</p>
              <p>3443</p>
            </div>
          </div>
        </div>
        <div className={styles.barcodeInputDiv}>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="size"
              value={sizeData.size}
              onChange={handleSizeInputChange}
              required
  
            />
            <span>Size</span>
          </div>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="qty"
              value={sizeData.qty}
              onChange={handleSizeInputChange}
              required
            />
            <span>Qty</span>
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
                setFormData={setSizeData}
                columnDefs={sizeColumns}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
              />
        </div>
      </div>
      <div
          className={styles.headBorder}
          style={{ marginLeft: "10px", marginRight: "10px" }}
        ></div>
      </div>
        <div
          className={styles.materialIssueOtherssDiv}
          onClick={() => toggleExpanded("details")}
        >
          <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
            <i className="fa-solid fa-file"></i>
            <h1>Other Details</h1>
          </div>

          <i
            className={`fa-solid fa-circle-chevron-down ${
              expandedState.details && styles.rotateTerms180
            }`}
          ></i>
        </div>
        {expandedState.details && (
          <>
         
         <div className={styles.materialOthersContent}>
  <div className={styles.materialIssueOthersDetailsDiv}>
    <div className={styles.materialOthersGridContainer}>
      <div className={styles.balanceContainer}>
        <div className={styles.balanceHeader}>Balance in BOM:</div>
        <div className={styles.balanceContent}>42/20, 43/45, 44/100</div>
      </div>
      <div className={styles.balanceContainer}>
        <div className={styles.balanceHeader}>Stock in Hand:</div>
        <div className={styles.balanceContent}>42/200, 43/45, 44/170, 45/220, 46/10, 47/90</div>
      </div>
      <div className={styles.balanceContainer}>
        <div className={styles.balanceHeader}>Balance in Inv:</div>
        <div className={styles.balanceContent}>40/2, 45/5</div>
      </div>
      <div className={styles.balanceContainer}>
        <div className={styles.balanceHeader}>Running Balance (BOM):</div>
        <div className={styles.balanceContent}>49/2, 45/5</div>
      </div>
    </div>
  </div>
</div>


          </>
        )}
      </div>
      {isViewData && (
        <KarigarDataViewPopup
          onCancel={() => {
            setViewDataPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default MaterialIssue;
