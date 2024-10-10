import React, { useState } from "react";
import styles from "../styles/newPo.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4

const workOrderData = {
  "03315/04": [
    { size: "13", desiredQty: 50 },
    { size: "22", desiredQty: 100 },
    { size: "45", desiredQty: 50 }
  ],
  "04416/05": [
    { size: "16", desiredQty: 70 },
    { size: "20", desiredQty: 80 },
    { size: "24", desiredQty: 50 }
  ]
};
const MasterCardCreation = () => {
  const [formData, setFormData] = useState({
    workOrder: "",
    lotQty: 200,
    season: "",
    orderQty: "",
    buyerName: "",
    article: "",
  });

  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

// Adjust the quantities based on lotQty
const adjustQuantities = (sizes, totalQty) => {
  const totalDesiredQty = sizes.reduce((acc, item) => acc + item.desiredQty, 0);
  let remainingQty = totalQty;

  if (totalQty >= totalDesiredQty) {
    // Case when lotQty is equal or more than the desiredQty sum
    const excessQty = totalQty - totalDesiredQty;
    
    // First allocate as per desiredQty, then distribute excess
    const extraPerSize = Math.floor(excessQty / sizes.length);
    let leftoverQty = excessQty % sizes.length;

    return sizes.map((item) => {
      let extra = extraPerSize;
      if (leftoverQty > 0) {
        extra += 1; // Distribute remainder one by one
        leftoverQty -= 1;
      }
      return { ...item, qty: item.desiredQty + extra };
    });
  } else {
    // Case when lotQty is less than the desiredQty sum
    const sortedSizes = sizes.sort((a, b) => b.desiredQty - a.desiredQty);
    const baseQty = Math.floor(totalQty / sizes.length); // Fair base allocation
    let leftoverQty = totalQty % sizes.length;

    return sortedSizes.map((item) => {
      let allocatedQty = baseQty;
      if (leftoverQty > 0) {
        allocatedQty += 1; // Distribute remaining quantity
        leftoverQty -= 1;
      }

      // Prioritize sizes with higher desiredQty if there is remaining qty
      return { ...item, qty: Math.min(item.desiredQty, allocatedQty) };
    });
  }
};

// Distribute lot quantity based on workOrderData
const distributeQuantity = (sizes, totalQty) => {
  return adjustQuantities(sizes, totalQty);
};

  // Handle Add/Edit item in grid
  const handleAddItem = () => {
    const selectedWorkOrder = formData.workOrder;
    const lotQty = parseInt(formData.lotQty, 10);
    
    if (selectedWorkOrder && lotQty > 0) {
      const sizes = workOrderData[selectedWorkOrder];
      const distributedItems = distributeQuantity(sizes, lotQty);

      const newGridData = distributedItems.map((item, index) => ({
        id: `${selectedWorkOrder}/${(index + 1).toString().padStart(3, '0')}`, // Generate master card number
        workOrder: selectedWorkOrder,
        season: item.size, // Assuming season is size here
        orderQty: item.qty,
      }));

      setItemGridData([...itemGridData, ...newGridData]);
    }

    // Reset form fields
    setFormData({
      workOrder: "",
      lotQty: "",
      season: "",
      orderQty: "",
      buyerName: "",
      article: "",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      workOrder: "",
      lotQty: "",
      season: "",
      orderQty: "",
      buyerName: "",
      article: "",
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
    { headerName: "Master Card No", field: "id", sortable: true, filter: true, width: 150 },
    { headerName: "Work Order", field: "workOrder", sortable: true, filter: true, width: 200 },
    { headerName: "Size", field: "season", sortable: true, filter: true, width: 150 },
    { headerName: "Qty", field: "orderQty", sortable: true, filter: true, width: 150 },
  ];


  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1 className={styles.headText}>Master Card Creation</h1>
          <button className={styles.viewDataButton}>View Data</button>
        </div>

        {/* Input Form */}
        <div className={styles.topContainer}>
          <div className={styles.masterCardCreationTopGrid}>
            {/* WORK ORDER (Combo Box) */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <select
                  name="workOrder"
                  value={formData.workOrder}
                  onChange={handleInputChange}
                  className={styles.basicInput}
                >
                  <option value="">Select Work Order</option>
                  {Object.keys(workOrderData).map((workOrder, index) => (
                    <option key={index} value={workOrder}>
                      {workOrder}
                    </option>
                  ))}
                </select>
                <span>WORK ORDER</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="number"
                  className={styles.basicInput}
                  name="lotQty"
                  value={formData.lotQty}
                  onChange={handleInputChange}
                />
                <span>LOT QTY</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  disabled
                  className={styles.basicInput}
                  name="season"
                  value={formData.season}
                  onChange={handleInputChange}
                />
                <span>SEASON</span>
              </div>
            </div>
        
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  disabled
                  className={styles.basicInput}
                  name="orderQty"
                  value={formData.orderQty}
                  onChange={handleInputChange}
                />
                <span>ORDER QTY</span>
              </div>
            </div>

            {/* BUYER NAME (Text Input) */}
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  disabled
                  className={styles.basicInput}
                  name="buyerName"
                  value={formData.buyerName}
                  onChange={handleInputChange}
                />
                <span>BUYER NAME</span>
              </div>
            </div>

            {/* ARTICLE (Text Input) */}
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  disabled
                  className={styles.basicInput}
                  name="article"
                  value={formData.article}
                  onChange={handleInputChange}
                />
                <span>ARTICLE</span>
              </div>
            </div>

            {/* Generate Button (Add to Grid) */}
            <div className={styles.colSpan}>
              <div>
                <button
                  onClick={handleAddItem}
                  className={styles.button50}
                  aria-label="Add"
                >
                  <span className={styles.button50__Content}>
                    <span className={styles.button50__Text}>
                      {isEditing ? "Edit" : "Generate"}
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

        {/* AG Grid Component */}
        <div style={{ marginLeft: "10px", marginRight: "10px" }}>
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
  );
};

export default MasterCardCreation;
