import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import AutoTable from "../features/AutoTable";

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
      const updatedGridData = [...data];
      updatedGridData[editIndex] = { ...formData };
      setData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setData([...data, { ...formData }]);
    }
    setFormData({
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
  };

  const handleEditItem = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData({ ...data[index] });
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
      productionSample: "P",
      totalIssued:"",
    
    });
  };

  const itemColumns = [
    {
      label: "From Opening Stock",
      path: "fromOpeningStock",
      width: "70px",
    },
    { label: "Item Name", path: "itemName", width: "150px" },
    { label: "Unit", path: "unit", width: "80px" },
    { label: "Supplier Name", path: "supplierName", width: "150px" },
    { label: "Item Qty", path: "itemQty", width: "80px" },
    { label: "Supp. Inv. No", path: "suppInvNo", width: "80px" },
    { label: "Total Issued", path: "totalIssued", width: "80px" },
  
    { label: "Production / Sample", path: "productionSample", width: "80px" },
    
  ];

  const [sizeGridData, setSizeGridData] = useState([]);
  const [sizeData, setSizeData] = useState({
    size: "",
    qty: "",
  });

  const sizeColumns = {
    size: { label: "Size", path: "size", width: "150px" },
    qty: { label: "Qty", path: "qty", width: "150px" },
  };
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
        <div className={styles.leftFloorReturnItemDiv} style={{ width: "75%" }}>
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
                      checked={formData.productionSample === "S"}
                      onChange={(e) =>
                        handleToggleChange(
                          "productionSample",
                          e.target.checked ? "S" : "P"
                        )
                      }
                    />
                    <div className={styles.switchWrapper}>
                      <div className={styles.switchToggle}>
                        {formData.productionSample === "S" ? "Samp" : "Prod"}
                      </div>
                    </div>
                  </label>
                </div>

                <div>
                  <button
                    onClick={handleAddItem}
                    className={styles.button50}
                    aria-label="Add"
                    style={{ width: "100px" }}
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
                      style={{ width: "100px" }}
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
          <AutoTable
            tableHeight="330px"
            data={data}
            setData={setData}
            columns={itemColumns}
            canDelete={true}
            canEdit={true}
            setFormData={setFormData}
            setIsEditing={setIsEditing}
            setEditIndex={setEditIndex}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </div>

        <div className={styles.rightkarigarItemDiv} style={{ width: "25%" }}>
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
            <AutoTable
              tableHeight="330px"
              data={sizeGridData}
              setData={setSizeGridData}
              columns={sizeColumns}
              canDelete={true}
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
