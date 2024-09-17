import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";

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
    productionSample: "P",
    repair: false,
    extraIssue: "Repair",
    remark: "",
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

 

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      itemName: "",
      unit: "",
      supplierName: "",
      suppInvNo: "",
      itemQty: "",
      fromOpeningStock: "No",
      productionSample: "Prod",
      totalIssued:"",
    
    });
  };

  const sizeColumns = [
    { headerName: "Size", field: "size", width: 150 },
    { headerName: "Qty", field: "qty", width: 150 },
  ];
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
  const itemColumns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "From Opening Stock", field: "fromOpeningStock", width: 100 },
    { headerName: "Item Name", field: "itemName", width: 150 },
    { headerName: "Unit", field: "unit", width: 80 },
    {
      headerName: "Caption",
      field: "productionSample",
      width: 100,
      cellRenderer: CustomCellRenderer, // Use the custom cell renderer here
    },
    { headerName: "Supplier Name", field: "supplierName", width: 150 },
    { headerName: "Item Qty", field: "itemQty", width: 80 },
    { headerName: "Supp. Inv. No", field: "suppInvNo", width: 80 },
    { headerName: "Total Issued", field: "totalIssued", width: 80 },
   
  ];
  

  const [sizeGridData, setSizeGridData] = useState([]);
  const [sizeData, setSizeData] = useState({
    size: "",
    qty: "",
  });


  const handleAddSize = () => {
    setSizeGridData([...sizeGridData, { ...sizeData }]);
    setSizeData({
      size: "",
      qty: "",
    });
  };
  const handleSizeInputChange = (e) => {
    const { name, value } = e.target;
    setSizeData({ ...sizeData, [name]: value });
  };
  return (
    <>
      <div className={styles.karigarTopContainer}>
        <div className={styles.leftFloorReturnItemDiv} style={{ width: "70%" }}>
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
                  style={{ width: "170px" }}
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
                  style={{ width: "200px" }}
                >
                  <input
                    type="text"
                    className={styles.basicInput}
                    name="totalIssued"
                    value={formData.totalIssued}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Total Issued</span>
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
                rowData={data}
                setIsEditing={setIsEditing}
                setRowData={setData}
                columnDefs={itemColumns}
                setFormData={setFormData}
                gridHeight="330px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
        </div>

        <div className={styles.rightkarigarItemDiv} style={{ width: "30%" }}>
          <div className={styles.floorSizeInputDiv}>
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
          <div style={{ marginTop: "51px" }}>
            <CustomAgGrid
                gridHeight="330px"
                rowData={sizeGridData}
                setRowData={setSizeGridData}
                columnDefs={sizeColumns}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
          </div>
        </div>
      </div>
    </>
  );
};

const MaterialFloorReturn = () => {
  const { isCollapsed } = useSidebar();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formData, setFormData] = useState({
    date: "",
    group: "",
    department: "",
    karigarName: "",
    articleNo: "",
    workOrderNo: "",
    activityName: "",
  });

  const columns = {
    date: { label: "Date", width: "140px" },
    group: { label: "Group", width: "200px" },
    department: { label: "Department", width: "200px" },
    karigarName: { label: "Karigar Name", width: isCollapsed ? "260px" : "250px" },
    articleNo: { label: "Article No.", width: "120px" },
    workOrderNo: { label: "Work Order No.", width: "120px" },
    activityName: { label: "Activity Name", width: isCollapsed ? "260px" : "200px", },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [isViewData, setViewDataPopup] = useState(false);

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Material (Floor Return)</h1>
       
        </div>
        <div className={styles.karigarTopContainer}>
          <div className={styles.inputLinerGrid}>
            <div className={styles.colSpanInputLiner}>
              <div className={styles.itemDetailsInput}>
                {Object.keys(columns).map((key, index) => (
                  <div key={index} className={styles.inputboxScroll}>
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
                      value={formData[key]}
                      onChange={handleInputChange}
                      style={{ width: columns[key].width }}
                    />
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

export default MaterialFloorReturn;
