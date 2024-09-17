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
    itemDescription: '',
    unit: '',
    qty: '',
    rate: '',
    qtySqft: '',
    rateSqft: '',
    hsnCode: '',
    igst: '',
    cgst: '',
    sgst: '',
    invNo: '',
    invDate: ''
  });

  const [gridData, setGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const headcolumns = {
 
    itemName: { label: "Item Name", path: "itemName", width: "220px" },
    itemDescription: { label: "Description", path: "itemDescription", width: "220px" },
    unit: { label: "Unit", path: "unit", width: "80px" },
    qty: { label: "Quantity", path: "qty", width: "100px" },
    rate: { label: "Rate", path: "rate", width: "100px" },
    qtySqft: { label: "Quantity (Sqft)", path: "qtySqft", width: "120px" },
    rateSqft: { label: "Rate (Sqft)", path: "rateSqft", width: "120px" },
    hsnCode: { label: "HSN Code", path: "hsnCode", width: "100px" },
    igst: { label: "IGST", path: "igst", width: "80px" },
    cgst: { label: "CGST", path: "cgst", width: "80px" },
    sgst: { label: "SGST", path: "sgst", width: "80px" },
    invNo: { label: "Invoice No", path: "invNo", width: "120px" },
    invDate: { label: "Invoice Date", path: "invDate", width: "140px" }
  };
  const columns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Item Name", field: "itemName", width: 220 },
    { headerName: "Description", field: "itemDescription", width: 220 },
    { headerName: "Unit", field: "unit", width: 80 },
    { headerName: "Quantity", field: "qty", width: 100 },
    { headerName: "Rate", field: "rate", width: 100 },
    { headerName: "Quantity (Sqft)", field: "qtySqft", width: 120 },
    { headerName: "Rate (Sqft)", field: "rateSqft", width: 120 },
    { headerName: "HSN Code", field: "hsnCode", width: 100 },
    { headerName: "IGST", field: "igst", width: 80 },
    { headerName: "CGST", field: "cgst", width: 80 },
    { headerName: "SGST", field: "sgst", width: 80 },
    { headerName: "Invoice No", field: "invNo", width: 120 },
    { headerName: "Invoice Date", field: "invDate", width: 140 }
  ];
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = gridData.map(item =>
        item.id === formData.id ? { ...formData } : item
      );
      setGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setGridData([...gridData, { id: uuidv4(), ...formData }]);
    }
    setFormData({
      id: '',
      itemName: '',
      itemDescription: '',
      unit: '',
      qty: '',
      rate: '',
      qtySqft: '',
      rateSqft: '',
      hsnCode: '',
      igst: '',
      cgst: '',
      sgst: '',
      invNo: '',
      invDate: ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      itemName: '',
      itemDescription: '',
      unit: '',
      qty: '',
      rate: '',
      qtySqft: '',
      rateSqft: '',
      hsnCode: '',
      igst: '',
      cgst: '',
      sgst: '',
      invNo: '',
      invDate: ''
    });
  };

  return (
    <div className={styles.itemDetailsTableContainer}>
      <div className={styles.inputLinerGrid}>
        <div className={styles.colSpanInputLiner}>
          <div className={styles.creditDetailsInput}>
            {Object.keys(headcolumns).map((key, index) => (
              <div key={index} className={styles.inputboxScroll}>
                <input
                  type={key === "invDate" ? "date" : "text"}
                  name={key}
                  className={styles.basicInput}
                  required
                  value={formData[key]}
                  onChange={handleInputChange}
                  style={{ width: headcolumns[key].width }}
                />
                <span>{headcolumns[key].label}</span>
              </div>
            ))}
            <button
              onClick={handleAddItem}
              className={styles.button50}
              aria-label="Add"
            >
              <span className={styles.button50__Content}>
                <span className={styles.button50__Text}>
                  {isEditing ? "Edit" : "Add Entry"}
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

      <div className={styles.gridSeperateParent}>

        <div className={styles.gridLeftInput}>
        <CustomAgGrid
                rowData={gridData}
                setIsEditing={setIsEditing}
                setRowData={setGridData}
                columnDefs={columns}
                setFormData={setFormData}
                gridHeight="330px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
        </div>
        <div className={styles.gridRightInput}>
        <div className={styles.creditTopGrid}>
 
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} required />
      <span>Freight</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} required />
      <span>Others</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} required />
      <span>TCS%</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} required />
      <span>CESS</span>
    </div>
  </div>
  
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput}  />
      <span>Roundoff</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} value={500} disabled />
      <span>Total CGST Amt</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} value={500} disabled />
      <span>Total SGST Amt</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} value={500} disabled />
      <span>Total IGST Amt</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} value={500} disabled />
      <span>TCS Amount</span>
    </div>
  </div>
  
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} value={500} disabled />
      <span>Total Taxable Amount</span>
    </div>
  </div>
  <div className={styles.colSpan}>
    <div className={styles.inputbox}>
      <input type="text" className={styles.basicInput} value={500} disabled />
      <span>Total Amount</span>
    </div>
  </div>
</div>


      </div>
      </div>
    </div>
  );
};



const CreditNote = () => {
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
        <h1>Credit Note (Export)</h1>
      </div>
      <div className={styles.topContainer}>
        <div className={styles.gateOutTopGrid}>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="date" className={styles.basicInput} required />
              <span>Date</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select className={styles.basicInput} required>
                <option value=""> Issue To</option>
                {/* Add your options here */}
                <option value="MAX MARA">MAX MARA</option>
              </select>
              <span>Issue To</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <select className={styles.basicInput} required>
                <option value=""> Credit Head</option>
                {/* Add your options here */}
                <option value="EXPORT SALE">EXPORT SALE</option>
              </select>
              <span>Credit Head</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="date" className={styles.basicInput} required />
              <span>Buyer DN Date</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="text" className={styles.basicInput} required />
              <span>Buyer DN No.</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="text" className={styles.basicInput} required />
              <span>E Way Bill No.</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="text" className={styles.basicInput} required />
              <span>Weight</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="text" className={styles.basicInput} required />
              <span>Pickup Point</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="text" className={styles.basicInput} required />
              <span>Remark</span>
            </div>
          </div>
          <div className={styles.colSpan}>
            <div className={styles.inputbox}>
              <input type="text" className={styles.basicInput} required />
              <span>Pkts</span>
            </div>
          </div>
          <div className={styles.colSpan2}>
  <div className={styles.inputbox}>
    <textarea className={styles.basicInput} required />
    <span>Narration</span>
  </div>
</div>

        </div>
        <div className={styles.headBorder}></div>
      </div>

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

export default CreditNote;