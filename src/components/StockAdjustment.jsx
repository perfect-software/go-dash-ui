import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import AutoTable from "../features/AutoTable";
import { v4 as uuidv4 } from 'uuid';
import CustomAgGrid from "../features/CustomAgGrid";

const StockAdjustment = () => {
  const [formData, setFormData] = useState({
    date: "",
    itemSubGroupName: "",
    itemName: "",
    supplierName: "",
    stockQty: "",
    qty: "",
    rate: "",
    caption: "Plus",
  });
  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);


  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = itemGridData.map(item =>
        item.id === formData.id ? { ...formData } : item
      );
      setItemGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setItemGridData([...itemGridData, { id: uuidv4(), ...formData }]);
    }
    setFormData({
      id: '',
      date: '',
      itemSubGroupName: '',
      itemName: '',
      supplierName: '',
      stockQty: '',
      qty: '',
      rate: '',
      caption: 'In',
    });
  };
  
  const CustomCellRenderer = (props) => {
    const { value } = props;
  
    const cellStyle = {
      backgroundColor: value === "Minus" ? "#f44336" : "#4caf50",
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
        {value === "Minus" ? "Minus" : "Plus"}
      </div>
    );
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      id: '',
      date: '',
      itemSubGroupName: '',
      itemName: '',
      supplierName: '',
      stockQty: '',
      qty: '',
      rate: '',
      caption: 'In',
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
    { headerName: "Date", field: "date", width: 140 },
    {
      headerName: "Item Sub Group Name",
      field: "itemSubGroupName",
      width: 200,
    },
    {
      headerName: "Caption",
      field: "caption",
      width: 100,
      cellRenderer: CustomCellRenderer, // Use the custom cell renderer here
    },
    { headerName: "Item Name", field: "itemName", width: 200 },
    { headerName: "Supplier Name", field: "supplierName", width: 200 },
    { headerName: "Stock Qty", field: "stockQty", width: 100 },
    { headerName: "Qty", field: "qty", width: 100 },
    { headerName: "Rate", field: "rate", width: 100 },
  
  ];
  

  const sizeColumns = [
    { headerName: "Size", field: "size", width: 100 },
    { headerName: "Balance Qty", field: "balanceQty", width: 150 },
    { headerName: "Qty", field: "qty", width: 100 },
  ];

  const sizeRowData = [
    { size: "Small", balanceQty: 10, qty: 5 },
    { size: "Medium", balanceQty: 20, qty: 10 },
    { size: "Large", balanceQty: 30, qty: 15 },
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.posubcontainer}>
        <div className={styles.titleContainer}>
          <h1>Stock Adjustment</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.stocktransferGrid}>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="date"
                  className={styles.basicInput}
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                <span>DATE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="itemSubGroupName"
                  value={formData.itemSubGroupName}
                  onChange={handleInputChange}
                  required
                />
                <span>ITEM SUB GROUP NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                />
                <span>ITEM NAME</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  required
                />
                <span>SUPPLIER NAME</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="stockQty"
                  value={formData.stockQty}
                  onChange={handleInputChange}
                  required
                />
                <span>STOCK QTY</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="qty"
                  value={formData.qty}
                  onChange={handleInputChange}
                  required
                />
                <span>QTY</span>
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
                <span>RATE</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div
                className={styles.switchContainer}
                style={{ margin: "auto" }}
              >
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    hidden
                    checked={formData.caption === "Minus"}
                    onChange={(e) =>
                      handleToggleChange(
                        "caption",
                        e.target.checked ? "Minus" : "Plus"
                      )
                    }
                  />
                  <div className={styles.switchWrapper}>
                    <div className={styles.switchToggle}>
                      {formData.caption === "Minus" ? "Minus" : "Plus"}
                    </div>
                  </div>
                </label>
              </div>
            </div>
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
        <div className={styles.stockTransferParentDiv}>
          <div className={styles.leftkarigarItemDiv} style={{ width: "75%" }}>
            <div>
              <CustomAgGrid
                rowData={itemGridData}
                setIsEditing={setIsEditing}
                setRowData={setItemGridData}
                columnDefs={itemColumns}
                setFormData={setFormData}
                gridHeight="420px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
            </div>
          </div>
          <div className={styles.rightkarigarItemDiv} style={{ width: "25%" }}>
           
              <CustomAgGrid
                gridHeight="420px"
                rowData={sizeRowData}
                columnDefs={sizeColumns}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
              />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;
