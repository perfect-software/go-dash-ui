import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";


import AutoTable from "../features/AutoTable";






const StockTransfer = () => {
  const [formData, setFormData] = useState({
    date: '',
    itemSubGroupName: '',
    itemName: '',
    supplierName: '',
    stockQty: '',
    qty: '',
    rate: '',
    caption: 'In'
  });
  const [itemGridData, setItemGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (index, checked) => {
    const updatedSelectedRows = checked
      ? [...selectedRows, index]
      : selectedRows.filter((i) => i !== index);
    setSelectedRows(updatedSelectedRows);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = [...itemGridData];
      updatedGridData[editIndex] = { ...formData };
      setItemGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setItemGridData([...itemGridData, { ...formData }]);
    }
    setFormData({
      date: '',
      itemSubGroupName: '',
      itemName: '',
      supplierName: '',
      stockQty: '',
      qty: '',
      rate: '',
      caption: 'In'
    });
  };

  const handleEditItem = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData({ ...itemGridData[index] });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      date: '',
      itemSubGroupName: '',
      itemName: '',
      supplierName: '',
      stockQty: '',
      qty: '',
      rate: '',
      caption: 'In'
    });
  };

  const itemColumns = {
    date: { label: "DATE", path: "date", width: "140px" },
    itemSubGroupName: { label: "ITEM SUB GROUP NAME", path: "itemSubGroupName", width: "200px" },
    itemName: { label: "ITEM NAME", path: "itemName", width: "200px" },
    supplierName: { label: "SUPPLIER NAME", path: "supplierName", width: "200px" },
    stockQty: { label: "STOCK QTY", path: "stockQty", width: "100px" },
    qty: { label: "QTY", path: "qty", width: "100px" },
    rate: { label: "RATE", path: "rate", width: "100px" },
    caption: { label: "Toggle", path: "caption", width: "100px", type: "toggle" }
  };

  const sizeColumns = {
    size: { label: "Size", path: "size", width: "100px" },
    balanceQty: { label: "Balance Qty", path: "balanceQty", width: "150px" },
    qty: { label: "Qty", path: "qty", width: "100px" }
  };

  const sizeRowData = [
    { size: 'Small', balanceQty: 10, qty: 5 },
    { size: 'Medium', balanceQty: 20, qty: 10 },
    { size: 'Large', balanceQty: 30, qty: 15 }
  ];

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.posubcontainer}>
      <div className={styles.titleContainer}>
          <h1>Stock Transfer</h1>
         
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
              <div className={styles.switchContainer} style={{margin:'auto'}}>
                <label className={styles.switch} >
                  <input
                    type="checkbox"
                    hidden
                    checked={formData.caption === "Out"}
                    onChange={(e) =>
                      handleToggleChange("caption", e.target.checked ? "Out" : "In")
                    }
                  />
                  <div className={styles.switchWrapper}>
                    <div className={styles.switchToggle}>
                      {formData.caption === "Out" ? "Out" : "In"}
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
          <div className={styles.stockTransferParentDiv}>
        <div className={styles.leftkarigarItemDiv} style={{ width: '75%' }}>
        
          <div>
            <AutoTable
              tableHeight='420px'
              data={itemGridData}
              setData={setItemGridData}
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
        </div>
        <div className={styles.rightkarigarItemDiv} style={{ width: '25%' }}>
          <div style={{ height: 305, width: '100%' }}>
            <AutoTable
              tableHeight='420px'
              data={sizeRowData}
              columns={sizeColumns}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StockTransfer;

