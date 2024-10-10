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
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";
import AllowRateDiffPopup from "../popups/AllowRateDiffPopup";

const ItemDetails = () => {
  const { isCollapsed } = useSidebar();

  const [gridData, setGridData] = useState([
    { woNo: '00828/01', color: 'D.BROWN', rate: 0, activity: 'CLOSING', groupName: 'CONVEYOR', qty: 780 },
    { woNo: '00828/01', color: 'D.BROWN', rate: 65, activity: 'CLOSING', groupName: 'WORKER', qty: 177 },
    { woNo: '00828/01', color: 'D.BROWN', rate: 68, activity: 'CLOSING', groupName: 'WORKER', qty: 47 },
  ]);

  const columns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: 'W/O NO.', field: 'woNo', sortable: true, filter: true },
    { headerName: 'COLOR', field: 'color', sortable: true, filter: true },
    { headerName: 'RATE', field: 'rate', sortable: true, filter: true },
    { headerName: 'ACTIVITY', field: 'activity', sortable: true, filter: true },
    { headerName: 'GROUP NAME', field: 'groupName', sortable: true, filter: true },
    { headerName: 'QTY.', field: 'qty', sortable: true, filter: true },
  ];
  

  return (
    <div className={styles.itemDetailsTableContainer}>
      <div
        className={`ag-theme-quartz ${styles.agThemeQuartz}`}
        style={{  width: "100%" }}
      >
       <CustomAgGrid
                gridHeight="420px"
                rowData={gridData}
                setRowData={setGridData}
                columnDefs={columns}
                editEnabled={false}
                deleteEnabled={true}
                pagination={false}
              />
      </div>
    </div>
  );
};
const AllowRateDiff = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [selectedPoNo, setSelectedPoNo] = useState("");
  const [autoFillMOrder, setAutoFillMOrder] = useState(false);
  const [tempBal, setTempBal] = useState("");
  const [autoFillSizeOrder, setAutoFillSizeOrder] = useState(false);
  const [selectedSizePoNo, setSelectedSizePoNo] = useState("");


  const [isViewData, setViewDataPopup] = useState(false);
  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Allow Rate Difference</h1>
          <button
            className={styles.viewDataButton}
            onClick={() => setViewDataPopup(true)}
          >
            View Data
          </button>
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
                <option value="AW-24">AW-24</option>
                {/* Add other season options as needed */}
            </select>
            <span>Season</span>
        </div>
    </div>

    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <select className={styles.basicInput} required>
                <option value="BOWER-08">BOWER-08</option>
                {/* Add other article options as needed */}
            </select>
            <span>Article</span>
        </div>
    </div>


    <div className={styles.colSpan2}>
        <div className={styles.inputbox}>
            <select className={styles.basicInput} required>
                <option value="CLOSING">CLOSING</option>
                {/* Add other base activity options as needed */}
            </select>
            <span>Base Activity</span>
        </div>
    </div>

   
    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <select className={styles.basicInput} required>
                <option value="00828/01">00828/01</option>
            
            </select>
            <span>Work Order</span>
        </div>
    </div>

    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <select className={styles.basicInput} required>
                <option value="CLOSING">CLOSING</option>
                {/* Add other activity options as needed */}
            </select>
            <span>Activity</span>
        </div>
    </div>
    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <input type="text" className={styles.basicInput} required />
            <span>Pair Qty</span>
        </div>
    </div>
    {/* RATE - Text input */}
    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <input type="text" className={styles.basicInput} required />
            <span>Rate</span>
        </div>
    </div>


    <div className={styles.colSpan2}>
        <div className={styles.inputbox}>
            <input className={styles.basicInput}  required />
            <span>Remark</span>
        </div>
    </div>
    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <input type="text" className={styles.basicInput} disabled required />
            <span>Color</span>
        </div>
    </div>
    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <input type="text" className={styles.basicInput} disabled required />
            <span>Order & Extra Qty</span>
        </div>
    </div>
    <div className={styles.colSpan2}>
        <div className={styles.inputbox}>
            <input type="text" className={styles.basicInput} disabled required />
            <span>Department Name</span>
        </div>
    </div>
    <div className={styles.colSpan}>
        <div className={styles.inputbox}>
            <input type="text" className={styles.basicInput} disabled required />
            <span>Total Wages Payout Qty</span>
        </div>
    </div>
</div>
          <div className={styles.headBorder}></div>
        </div>

        {activePage === "itemDetails" && <ItemDetails />}
      </div>
      {isViewData && (
        <AllowRateDiffPopup
          onClose={() => {
            setViewDataPopup(false);
          }}
        />
      )}
    </div>
  );
};

export default AllowRateDiff;
