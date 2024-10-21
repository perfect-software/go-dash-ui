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


import { generatePDF } from "../features/generateBuyerPDF";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { fetchAllItemRates } from "../reducer/itemRateSlice";
import { useSelector, useDispatch } from "react-redux";
import tableStyles from "../styles/bom.module.css";
import AutoTable from "../features/AutoTable";
import CustomAgGrid from "../features/CustomAgGrid";

const ItemDetails = () => {
  const { isCollapsed } = useSidebar();

  const [gridData, setGridData] = useState([
    {
      id:'1',
      itemId: { name: 'Item 1' },
      unit: 'kg',
      articleNo: 'A001',
      qty: 100,
      balQty: 50,
      reqQty: 20,
      rate: 10.5,
      hsn: '1234',
      cgst: 5,
      sgst: 5,
      igst: 10,
      remark: 'First item remark'
    },
    {
      id:'2',
      itemId: { name: 'Item 2' },
      unit: 'ltr',
      articleNo: 'A002',
      qty: 200,
      balQty: 150,
      reqQty: 30,
      rate: 20.5,
      hsn: '5678',
      cgst: 12,
      sgst: 12,
      igst: 24,
      remark: 'Second item remark'
    },
    {
      id:'3',
      itemId: { name: 'Item 3' },
      unit: 'pcs',
      articleNo: 'A003',
      qty: 300,
      balQty: 100,
      reqQty: 50,
      rate: 30.5,
      hsn: '9101',
      cgst: 18,
      sgst: 18,
      igst: 36,
      remark: 'Third item remark'
    }
  ]);

  const columns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Item Name", field: "itemId.name", width: 200 },
    { headerName: "Unit", field: "unit", width: 100 },
    { headerName: "Article No", field: "articleNo",  },
    { headerName: "Qty", field: "qty",  },
    { headerName: "Bal Qty", field: "balQty", },
    { headerName: "Req Qty", field: "reqQty",  },
    { headerName: "Rate", field: "rate", },
    { headerName: "HSN", field: "hsn",  },
    { headerName: "CGST", field: "cgst", },
    { headerName: "SGST", field: "sgst", },
    { headerName: "IGST", field: "igst", },
    { headerName: "Remark", field: "remark", }
  ];
  

  return (
    <div className={styles.itemDetailsTableContainer}>
      <div
        className={`ag-theme-quartz ${styles.agThemeQuartz}`}
        style={{  width: "100%" }}
      >
       <CustomAgGrid
                gridHeight="500px"
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
const GatePassReceiveMisc = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [selectedPoNo, setSelectedPoNo] = useState("");
  const [autoFillMOrder, setAutoFillMOrder] = useState(false);
  const [tempBal, setTempBal] = useState("");
  const [autoFillSizeOrder, setAutoFillSizeOrder] = useState(false);
  const [selectedSizePoNo, setSelectedSizePoNo] = useState("");


  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Gate Pass Receive (Misc)</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
          <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Gate Pass No</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="date" className={styles.basicInput} required />
                <span>Date</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input disabled type="text" className={styles.basicInput} required />
                <span>Issue To</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input disabled type="text" className={styles.basicInput} required />
                <span>Vehicle No.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input disabled type="text" className={styles.basicInput} required />
                <span>Sender</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input disabled type="text" className={styles.basicInput} required />
                <span>Mode of Transport</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input disabled type="text" className={styles.basicInput} required />
                <span>Bearer</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input disabled type="text" className={styles.basicInput} required />
                <span>Remark</span>
              </div>
            </div>

           
          </div>
          <div className={styles.headBorder}></div>
        </div>

        {activePage === "itemDetails" && <ItemDetails />}
      </div>
    </div>
  );
};

export default GatePassReceiveMisc;
