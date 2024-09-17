import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import CustomAgGrid from "../features/CustomAgGrid";


const ItemDetails = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemQty: '',
    reqQty: ''
  });

  const [barcodeData, setBarcodeData] = useState({
    barcode: '',
    dm: ''
  });
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    console.log("Selected Rows Data:", selectedRows.map(index => data[index]));
  }, [selectedRows]);


  const [itemGridData, setItemGridData] = useState([]);
  const [barcodeGridData, setBarcodeGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      itemName: '',
      itemQty: '',
      reqQty: ''
    });
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      itemName: '',
      itemQty: '',
      reqQty: ''
    });
  };

  const itemColumns = [
    {
      headerName: "Select",
      field: "select",
      width: 120,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: "Item Name", field: "itemName", width: 350 },
    { headerName: "Item Qty", field: "itemQty", width: 150 },
    { headerName: "Req Qty", field: "reqQty", width: 150 }
  ];
  
  const sizeColumns = [
    { headerName: "Size", field: "size", width: 100 },
    { headerName: "Balance Qty", field: "balanceQty", width: 150 },
    { headerName: "Qty", field: "qty", width: 100 }
  ];
  
  const sizeRowData = [
    { size: 'Small', balanceQty: 10, qty: 5 },
    { size: 'Medium', balanceQty: 20, qty: 10 },
    { size: 'Large', balanceQty: 30, qty: 15 }
  ];
  

  return (
    <div className={styles.dmtrparentOthersDiv}>
      <div className={styles.leftkarigarItemDiv} style={{width:'60%'}}>
        <div className={styles.itemNameKarigarInputDiv}>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              required
              style={{ width: '350px' }}
            />
            <span>Item Name</span>
          </div>
          <div className={styles.inputbox}>
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
          <div className={styles.inputbox}>
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
          <button
            onClick={handleAddItem}
            className={styles.button50}
            aria-label="Add"
            style={{ width: '400px' }}
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
              style={{ width: '400px' }}
            >
              <span className={styles.button50__Content}>
                <span className={styles.button50__Text}>Cancel</span>
              </span>
            </button>
          )}
        </div>
        <div>
        <CustomAgGrid
                rowData={itemGridData}
                setIsEditing={setIsEditing}
                setRowData={setItemGridData}
                columnDefs={itemColumns}
                setFormData={setFormData}
                gridHeight="354px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
        </div>
      </div>
  
      <div className={styles.rightkarigarItemDiv} style={{width:'40%'}}>
        <div
          className={`ag-theme-quartz ${styles.agThemeQuartz}`}
          style={{  width: '100%' }}
        >
          <CustomAgGrid
                gridHeight="390px"
                rowData={sizeRowData}
                columnDefs={sizeColumns}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
              />
        </div>
      </div>
    </div>
  );
};




const KarigarJobCardSecond = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [formData, setFormData] = useState({
    date: '',
    group: '',
    department: '',
    karigarName: '',
    articleNo: '',
    workOrderNo: '',
    activityName: '',
    sampleRequestNo: '',
    repairSlipNo: '',
    remark: '',
    qty: '',
    rate: '',
  });

  const columns = {
    date: { label: 'Date', width: '140px' },
    group: { label: 'Group', width: '200px' },
    articleNo: { label: 'Article No.', width: '130px' },
    activityName: { label: 'Activity Name', width: '200px' },
    karigarName: { label: 'Karigar Name', width: '285px' },
    sampleRequestNo: { label: 'Sample Request No.', width: '140px' },
    department: { label: 'Department', width: '200px' },
    workOrderNo: { label: 'Work Order No.', width: '130px' },
    repairSlipNo: { label: 'Repair Slip No.', width: '140px' },
    remark: { label: 'Remark', width: '180px' },
    qty: { label: 'Qty', width: '70px' },
    rate: { label: 'Rate', width: '70px' },
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
          <h1>Karigar Job Card 2</h1>
          <button className={styles.viewDataButton}  onClick={() => setViewDataPopup(true)}>View Data</button>
        </div>
        <div className={styles.karigarTopContainer}>
        <div className={styles.inputLinerGrid}>
      <div className={styles.colSpanInputLiner}>
        <div className={styles.itemDetailsInput}>
          {Object.keys(columns).map((key, index) => (
            <div key={index} className={styles.inputboxScroll}>
              <input
                type={key === 'date' ? 'date' : key === 'qty' || key === 'rate' ? 'number' : 'text'}
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
<div className={styles.midKarigarOthersDiv}>
     
        <div>
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
              <p>Total Issue Pair In Activity</p>
              <p>34343</p>
            </div>

            <div>
              <p>Total Req In Bom (item)</p>
              <p>3443</p>
            </div>

          </div>
        </div>
      </div>
  </div>
    
  <div className={styles.headBorder} style={{marginLeft:'10px', marginRight:'10px'}}></div>

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

export default KarigarJobCardSecond;