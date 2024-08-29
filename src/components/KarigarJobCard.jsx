import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { Country, State, City } from "country-state-city";
import Currencydata from "currency-codes/data";
import Edit3dIcon from "../assets/edit3d.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import UpIcon from "../assets/up.svg";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import AutoTable from "../features/AutoTable";
import { postApiService } from "../service/apiService";
import ViewBuyer from "./ViewBuyer";
import Downshift from "downshift";
import VerifiedIcon from "../assets/verified.svg";
import SizeIcon from "../assets/sizeButton.svg";
import WorkIcon from "../assets/workOrderButton.svg";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { generatePDF } from "../features/generateBuyerPDF";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchAllItemRates } from "../reducer/itemRateSlice";
import { useSelector, useDispatch } from "react-redux";
import tableStyles from "../styles/bom.module.css";
import KarigarDataViewPopup from "../popups/KarigarDataViewPopup";
import { v4 as uuidv4 } from 'uuid';
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

  const [itemGridData, setItemGridData] = useState([]);
  const [barcodeGridData, setBarcodeGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBarcodeInputChange = (e) => {
    const { name, value } = e.target;
    setBarcodeData({ ...barcodeData, [name]: value });
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

  const handleAddBarcode = () => {
    setBarcodeGridData([...barcodeGridData, { ...barcodeData }]);
    setBarcodeData({
      barcode: '',
      dm: ''
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
      itemName: '',
      itemQty: '',
      reqQty: ''
    });
  };

  const itemColumns = [
    {
      headerName: "Select",
      field: "select",
      width: 140,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: "Item Name", field: "itemName", width: 180 },
    { headerName: "Item Qty", field: "itemQty", width: 100 },
    { headerName: "Req Qty", field: "reqQty", width: 100 }
  ];
  

  const barcodeColumns = [
    {
      headerName: "Select",
      field: "select",
      width: 150,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { headerName: "Barcode", field: "barcode", width: 150 },
    { headerName: "DM", field: "dm", width: 150 }
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
      <div className={styles.leftkarigarItemDiv}>
        <div className={styles.itemNameKarigarInputDiv}>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              required
              style={{ width: '250px' }}
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
            style={{ width: '200px' }}
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
              style={{ width: '200px' }}
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
                gridHeight="345px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
        </div>
      </div>
      <div className={styles.midkarigarItemDiv}>
        <div className={styles.barcodeInputDiv}>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="barcode"
              value={barcodeData.barcode}
              onChange={handleBarcodeInputChange}
              required
              style={{ width: '250px' }}
            />
            <span>Barcode</span>
          </div>
          <div className={styles.inputbox}>
            <input
              type="text"
              className={styles.basicInput}
              name="dm"
              value={barcodeData.dm}
              onChange={handleBarcodeInputChange}
              required
            />
            <span>DM</span>
          </div>
          <button
            onClick={handleAddBarcode}
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
                gridHeight="345px"
                rowData={barcodeGridData}
                setRowData={setBarcodeGridData}
                columnDefs={barcodeColumns}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
        </div>
      </div>
      <div className={styles.rightkarigarItemDiv}>
        <div
          className={`ag-theme-quartz ${styles.agThemeQuartz}`}
          style={{width: '100%' }}
        >
         <CustomAgGrid
                gridHeight="378px"
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


const OtherDetails = () => {
  const [data, setData] = useState([
    { select: false, ticketNo: "00350/01/001-00001", pairQty: 10 },
    { select: false, ticketNo: "00350/01/001-00002", pairQty: 10 },
    { select: true, ticketNo: "00350/01/001-00002", pairQty: 30 },
   
  ]);


  const columns = [
    {
      headerName: "Select",
      field: "select",
      width: 180,
      cellRendererFramework: (params) => (
        <input type="checkbox" checked={params.value} onChange={(e) => params.context.handleSelectChange(params.node.id, e.target.checked)} />
      ),
      editable: true,
    },
    {
      headerName: "Ticket No.",
      field: "ticketNo",
      width: 250
    },
    {
      headerName: "Pair Qty",
      field: "pairQty",
      width: 150
    }
  ];



  return (
    <div className={styles.dmtrKarigarparentOthersDiv}>
      <div className={styles.rightKarigarOthersDiv}>
        <div>
        <CustomAgGrid
            rowData={data}
            setRowData={setData}
            columnDefs={columns}
            gridHeight="360px"
            editEnabled={false}
            deleteEnabled={false}
            pagination={true}
            gridOpt={true}
          
          />
        </div>
      </div>
    </div>
  );
};


const KarigarJobCard = () => {
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
          <h1>Karigar Job Card</h1>
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
    
  <div className={styles.drtrmidDetails}>
          <div className={styles.midDetailsTitle}>
            <div className={styles.toggleButtons}>
            
              <button
                className={`${styles.screenChangeButton} ${activePage === "itemDetails" ? styles.active : ""}`}
                onClick={() => setActivePage("itemDetails")}
              >
                Item Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${activePage === "otherDetails" ? styles.active : ""}`}
                onClick={() => setActivePage("otherDetails")}
              >
                Other Details
              </button>
            </div>
          </div>
        </div>
        {activePage === "itemDetails" && <ItemDetails />}
        {activePage === "otherDetails" && (
          <OtherDetails/>
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

export default KarigarJobCard;