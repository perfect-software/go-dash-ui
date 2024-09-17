import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import styles2 from "../styles/outlinedInput.module.css";
import { Country, State, City } from "country-state-city";
import Currencydata from "currency-codes/data";
import Edit3dIcon from "../assets/edit3d.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import UpIcon from "../assets/up.svg";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { fetchAllBuyers } from "../reducer/buyersSlice";
import { gsap } from 'gsap';
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

import { useSelector, useDispatch } from "react-redux";
import tableStyles from "../styles/bom.module.css";
import CustomAgGrid from "../features/CustomAgGrid";


const ItemDetails = () => {
  const { isCollapsed } = useSidebar();

  const [gridData, setGridData] = useState([]);


  const [isSizeChecked, setIsSizeChecked] = useState(false);
  const [isWorkChecked, setIsWorkChecked] = useState(false);


  useEffect(() => {
    
    const storedSizeChecked = localStorage.getItem('isSizeChecked') === 'true';
    const storedWorkChecked = localStorage.getItem('isWorkChecked') === 'true';
    setIsSizeChecked(storedSizeChecked);
    setIsWorkChecked(storedWorkChecked);
  }, []);

  useEffect(() => {
    localStorage.setItem('isSizeChecked', isSizeChecked);
    localStorage.setItem('isWorkChecked', isWorkChecked);
  }, [isSizeChecked, isWorkChecked]);

  const columnDefs2 = [
    { headerName: "Barcode", field: "barcode", width: "150px" },
    { headerName: "Quantity", field: "qtyFt", width: "100px" },
  ]
  const columnDefs = [
   
    { headerName: "Item Name", field: "itemName", width: "200px" },
    { headerName: "Unit", field: "unit", width: "90px" },
    { headerName: "Quantity", field: "qtyFt", width: "150px" },
    { headerName: "Rate", field: "rateFt", width: "100px" },
    { headerName: "Pieces", field: "pcs", width: "100px" },
    { headerName: "Item Remark", field: "packet", width: "200px" },

    
  ];

  const defaultColDef = {
    tooltipComponent: "customTooltip",
  };

  return (
    <div className={styles.itemDetailsTableContainer}>
    
     <div className={styles.parentGateReceive}>
     <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{  width: "100%" }}
      >
       <CustomAgGrid
                gridHeight="325px"
                rowData={gridData}
                columnDefs={columnDefs}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
      </div>

      <div  style={{width:'45%'}}>
   
      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{  width: '100%' }}
      >
        <CustomAgGrid
                 gridHeight="325px"
                rowData={gridData}
                columnDefs={columnDefs2}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              /> 
      </div>
    </div>
     </div>
     


    </div>
  );
};

const SupplierDetails = ({ orders }) => {
  return (
    <div className={styles.dmtrparentOthersDiv}>
      <div className={styles.leftSupplierDmtrOthersDiv}>
        <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
          <h1>Supplier Details</h1>
        </div>
        <div className={styles.supplierInfo}>
          <div className={styles.supplierTitle}>
            <i class="fa-solid fa-industry"></i>
            <div className={styles.supplierTitleContainer}>
              <h1>INFINITE ADHESIVE PRIVATE LIMITED</h1>
              <p>
                {" "}
                GSTIN : ALUPC343DE{" "}
                <span>
                  {" "}
                  <img
                    className={styles.verifiedIcon}
                    src={VerifiedIcon}
                    alt=""
                  />{" "}
                </span>
              </p>
            </div>
          </div>
          <div className={styles.roundedDivider}></div>
          <div className={styles.supplierGridContainer}>
            <div>
              <p>Contact Person</p>
              <p>Mr. Ram Kumar</p>
            </div>
            <div>
              <p>Phone Number</p>
              <p>9455645346</p>
            </div>
            <div>
              <p>Email Address</p>
              <p>ramkumar@12gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightBillDmtrOthersDiv}>
        <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
          <i className="fa fa-inr" aria-hidden="true"></i>
          <h1>Bill Details</h1>
        </div>
        <div>
          <div className={styles.priceGridContainer}>
            <div>
              <p>Taxable Value</p>
              <p>₹ 12434.543</p>
            </div>

            <div>
              <p>Total Gst</p>
              <p>₹ 45446</p>
            </div>

            <div>
              <p>Total Cess</p>
              <p>₹ 34343</p>
            </div>

            <div>
              <p>Additional Discount</p>
              <p>₹ 3443</p>
            </div>

            <div>
              <p>Round Off</p>
              <p>₹ 3333</p>
            </div>
            <div className={styles.roundedDivider}></div>
            <div>
              <p>Total Amount</p>
              <strong>₹ 434553</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const OtherDetails = ({
  tempBal,
  selectedPoNo,
  selectedSizePoNo,
  autoFillMOrder,
  autoFillSizeOrder,
  mOrder,
  sizeOrder,
  setAutoFillMOrder,
  setAutoFillSizeOrder,
  updateMOrder,
  updateSizeOrder,
  mColumnDefs,
  sizeColumnDefs
}) => {
  const [currentBalQty, setCurrentBalQty] = useState(tempBal);

  useEffect(() => {
    setCurrentBalQty(tempBal);
  }, [tempBal]);

  const fillQuantity = (balQty, type) => {
    let remainingQty = balQty;
    if (type === "mOrder") {
      const updatedMOrder = mOrder.map((order) => {
        if (remainingQty > 0) {
          const useQty = order.useQty ? parseInt(order.useQty) : 0;
          const newBalQty = Math.max(0, remainingQty - useQty);
          remainingQty -= useQty;
          return { ...order, balQty: newBalQty };
        }
        return order;
      });
      updateMOrder(updatedMOrder);
    } else if (type === "sizeOrder") {
      const updatedSizeOrder = sizeOrder.map((order) => {
        if (remainingQty > 0) {
          const useQty = order.useQty ? parseInt(order.useQty) : 0;
          const newBalQty = Math.max(0, remainingQty - useQty);
          remainingQty -= useQty;
          return { ...order, balQty: newBalQty };
        }
        return order;
      });
      updateSizeOrder(updatedSizeOrder);
    }
    setCurrentBalQty(remainingQty);
  };

  const clearBalQty = (type) => {
    if (type === "mOrder") {
      const updatedMOrder = mOrder.map((order) => ({
        ...order,
        balQty: "",
      }));
      updateMOrder(updatedMOrder);
    } else if (type === "sizeOrder") {
      const updatedSizeOrder = sizeOrder.map((order) => ({
        ...order,
        balQty: "",
      }));
      updateSizeOrder(updatedSizeOrder);
    }
  };

  const handleCheckboxChangeMOrder = () => {
    setAutoFillMOrder(!autoFillMOrder);
    if (!autoFillMOrder && selectedPoNo) {
      fillQuantity(tempBal, "mOrder");
    } else if (autoFillMOrder) {
      clearBalQty("mOrder");
    }
  };

  const handleCheckboxChangeSizeOrder = () => {
    setAutoFillSizeOrder(!autoFillSizeOrder);
    if (!autoFillSizeOrder && selectedSizePoNo) {
      fillQuantity(tempBal, "sizeOrder");
    } else if (autoFillSizeOrder) {
      clearBalQty("sizeOrder");
    }
  };

  const onCellValueChanged = (params, orderType) => {
    const updatedRow = params.data;
    let updatedData;
    if (orderType === 'mOrder') {
      updatedData = mOrder.map(row =>
        row.mOrderNo === updatedRow.mOrderNo ? updatedRow : row
      );
      updateMOrder(updatedData);
    } else {
      updatedData = sizeOrder.map(row =>
        row.size === updatedRow.size ? updatedRow : row
      );
      updateSizeOrder(updatedData);
    }

    fillQuantity(tempBal, orderType);
  };

  const editableColumnDefs = (columnDefs, orderType) => {
    return columnDefs.map(col => ({
      ...col,
      editable: col.field === 'useQty',
      onCellValueChanged: (params) => onCellValueChanged(params, orderType)
    }));
  };

  const mColumnDefsWithTempBal = mColumnDefs.map(col => {
    if (col.field === 'balQty') {
      return {
        ...col,
        headerName: `Bal Qty (${currentBalQty})`,
        editable: false
      };
    }
    return { ...col };
  });

  const sizeColumnDefsWithTempBal = sizeColumnDefs.map(col => {
    if (col.field === 'balQty') {
      return {
        ...col,
        headerName: `Bal Qty (${currentBalQty})`,
        editable: false
      };
    }
    return { ...col };
  });

  const mColumnDefsEditable = editableColumnDefs(mColumnDefsWithTempBal, 'mOrder');
  const sizeColumnDefsEditable = editableColumnDefs(sizeColumnDefsWithTempBal, 'sizeOrder');

  const [barcode, setBarcode] = useState('');
  const [dm, setDm] = useState('');
  const [gridData, setGridData] = useState([]);

  const handleAddItem = () => {
    const newItem = { barcode, dm };
    setGridData([...gridData, newItem]);
    setBarcode('');
    setDm('');
  };

  const handleDeleteItem = (index) => {
    const updatedData = gridData.filter((_, i) => i !== index);
    setGridData(updatedData);
  };

  const columnDefs = [
    { headerName: 'Barcode', field: 'barcode' },
    { headerName: 'DM', field: 'dm' },
    {
      headerName: 'Delete',
      field: 'delete',
      width: 70,
      cellRenderer: (params) => (
        <div
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
          }}
        >
          <img
            src={Delete3dIcon}
            className={styles.sizeButton}
            onClick={() => handleDeleteItem(params.node.rowIndex)}
          />
        </div>
      ),
    },
  ];


  return (
    <div className={styles.dmtrparentOthersDiv}>
      <div className={styles.leftGatePassOthersDiv}>
        <div className={styles.tabletitle}>
          <h2>PO Number: {selectedPoNo}</h2>
          <label className={styles.checkboxContainer}>
            Autofill Quantity
            <input
              type="checkbox"
              checked={autoFillMOrder}
              onChange={handleCheckboxChangeMOrder}
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>

        <div
          className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
          style={{ height: 305, width: "100%" }}
        >
          <AgGridReact
            columnDefs={mColumnDefsEditable}
            rowData={mOrder}
            onCellValueChanged={(params) => onCellValueChanged(params, 'mOrder')}
          />
        </div>
      </div>
      <div className={styles.midGatePassOthersDiv}>
        <div className={styles.tabletitle}>
          <h2>PO Number: {selectedSizePoNo}</h2>
          <label className={styles.checkboxContainer}>
            Autofill Quantity
            <input
              type="checkbox"
              checked={autoFillSizeOrder}
              onChange={handleCheckboxChangeSizeOrder}
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>

        <div
          className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
          style={{ height: 305, width: "100%" }}
        >
          <AgGridReact
            columnDefs={sizeColumnDefsEditable}
            rowData={sizeOrder}
            onCellValueChanged={(params) => onCellValueChanged(params, 'sizeOrder')}
          />
        </div>
      </div>
      <div className={styles.rightGatePassOthersDiv}>
      <div className={styles.tabletitle}>
        <h2>PO Number: {selectedSizePoNo}</h2>
      </div>
      <div className={styles.barcodeInputDiv}>
        <div className={styles.inputbox}>
          <input
            type="text"
            className={styles.basicInput}
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
          />
          <span>Barcode</span>
        </div>
        <div className={styles.inputbox}>
          <input
            type="text"
            className={styles.basicInput}
            value={dm}
            onChange={(e) => setDm(e.target.value)}
            required
          />
          <span>DM</span>
        </div>
        <button
          onClick={handleAddItem}
          className={styles.button50}
          aria-label="Add"
        >
          <span className={styles.button50__Content}>
            <span className={styles.button50__Text}>Add</span>
          </span>
        </button>
      </div>
      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{ height: 252, width: '100%' }}
      >
        <AgGridReact columnDefs={columnDefs} rowData={gridData} />
      </div>
    </div>
    </div>
  );
};



const GatePassReceive = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [selectedPoNo, setSelectedPoNo] = useState("");
  const [autoFillMOrder, setAutoFillMOrder] = useState(false);
  const [tempBal, setTempBal] = useState("");
  const [autoFillSizeOrder, setAutoFillSizeOrder] = useState(false);
  const [selectedSizePoNo, setSelectedSizePoNo] = useState("");

  const [data, setData] = useState([
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Doe', age: 32 },
    { id: 3, name: 'Billy Joe', age: 45 }
  ]);

  const handleDelete = (id) => {
    const element = document.getElementById(`row-${id}`);
    const tl = gsap.timeline();

    tl.to(element, { 
      y: '-15px', 
      scaleY: 0.9, 
      duration: 0.3 
    })
    .to(element, { 
      morphSVG: '#step-2', 
      duration: 0.3 
    })
    .to(element, { 
      morphSVG: '#step-3', 
      duration: 0.3 
    })
    .to(element, {
      y: '0',
      scaleY: 1,
      duration: 0.3,
      onComplete: () => {
        setData(data.filter(item => item.id !== id));
      }
    });
  };
  const mColumnDefs = [
    { headerName: "MOrder No.", field: "mOrderNo" },
    { headerName: "Use Qty", field: "useQty", editable: true },
    { headerName: "Bal. Qty", field: "balQty" },
  ];

  const sizeColumnDefs = [
    { headerName: "SIZE", field: "size" },
    { headerName: "USE QTY", field: "useQty", editable: true },
    { headerName: "BAL QTY", field: "balQty" },
  ];

  const [sizeOrder, setSizeOrder] = useState([
    { size: "Small", useQty: 800 },
    { size: "Medium", useQty: 1200 },
    { size: "Large", useQty: 1600 },
    { size: "X-Large", useQty: 300 },
    { size: "XX-Large", useQty: 150 },
  ]);

  const [mOrder, setMOrder] = useState([
    { mOrderNo: "00790/01", useQty: "50" },
    { mOrderNo: "00794/01", useQty: "100" },
    { mOrderNo: "00795/01", useQty: "" },
    { mOrderNo: "00796/01", useQty: "200" },
    { mOrderNo: "00797/01", useQty: "" },
  ]);

  const updateMOrder = (updatedData) => {
    setMOrder(updatedData);
  };

  const updateSizeOrder = (updatedData) => {
    setSizeOrder(updatedData);
  };

  const handleButtonClick = (data, type) => {
    if (type === "mOrder") {
      setSelectedPoNo(data.poNo);
      setTempBal(data.balQty);
      if (autoFillMOrder) {
        fillQuantity(data.balQty, "mOrder");
      }
    } else if (type === "sizeOrder") {
      setSelectedSizePoNo(data.poNo);
      if (autoFillSizeOrder) {
        fillQuantity(data.balQty, "sizeOrder");
      }
    }
  };

  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Gate Pass Receive</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateTopGrid}>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  required
                />
                <span>REC GATE PASS NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  required
                />
                <span>SR No.</span>
              </div>
            </div>
         
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  required
                />
                <span>Vehicle No.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  required
                />
                <span>Issue No</span>
              </div>
            </div>
           
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="date"
                  className={styles.basicInput}
                  required
                />
                <span>SR Date</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  required
                />
                <span>Mode Of Transport</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input
                  type="text"
                  className={styles.basicInput}
                  required
                />
                <span>Remark</span>
              </div>
            </div>
    
         
          </div>
        </div>
        <div className={styles.drtrmidDetails}>
        
        </div>
        {activePage === "itemDetails" && <ItemDetails handleButtonClick={handleButtonClick} setActivePage={setActivePage} />}
    
      </div>

    </div>
  );
};

export default GatePassReceive;