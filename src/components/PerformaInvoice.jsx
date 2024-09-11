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
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from 'uuid';

const ItemDetails = () => {
  const { isCollapsed } = useSidebar();

  const [formData, setFormData] = useState({
    buyerGroup: "",
    buyerOrderNo: "",
    articleNo: "",
    color: "",
    buyerArticleNo: "",
    buyerArticleColor: "",
    orderNo: "",
    stockNo: "",
    workOrder: "",
    deliveryDate: "",
    sizeRange: "",
    qty: "",
    rate: "",
  });

  const [gridData, setGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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
      buyerGroup: "",
      buyerOrderNo: "",
      articleNo: "",
      color: "",
      buyerArticleNo: "",
      buyerArticleColor: "",
      orderNo: "",
      stockNo: "",
      workOrder: "",
      deliveryDate: "",
      sizeRange: "",
      qty: "",
      rate: "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      buyerGroup: "",
      buyerOrderNo: "",
      articleNo: "",
      color: "",
      buyerArticleNo: "",
      buyerArticleColor: "",
      orderNo: "",
      stockNo: "",
      workOrder: "",
      deliveryDate: "",
      sizeRange: "",
      qty: "",
      rate: "",
    });
  };

  const columns = {
    buyerGroup: { label: "Buyer Group", path: "buyerGroup", width: "200px" },
    buyerOrderNo: {
      label: "Buyer Order No",
      path: "buyerOrderNo",
      width: "150px",
    },
    articleNo: { label: "Article No", path: "articleNo", width: "100px" },
    color: { label: "Color", path: "color", width: "100px" },
    buyerArticleNo: {
      label: "Buyer Article No",
      path: "buyerArticleNo",
      width: "150px",
    },
    buyerArticleColor: {
      label: "Buyer Article Color",
      path: "buyerArticleColor",
      width: "150px",
    },
    orderNo: { label: "Order No.", path: "orderNo", width: "100px" },
    stockNo: { label: "Stock No.", path: "stockNo", width: "100px" },
    workOrder: { label: "Work Order", path: "workOrder", width: "100px" },
    deliveryDate: {
      label: "Delivery Date",
      path: "deliveryDate",
      width: "120px",
    },
    sizeRange: { label: "Size Range", path: "sizeRange", width: "100px" },
    qty: { label: "Qty", path: "qty", width: "50px" },
    rate: { label: "Rate", path: "rate", width: "70px" },
  };
  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Buyer Group", field: "buyerGroup", width: 200 },
    { headerName: "Buyer Order No", field: "buyerOrderNo", width: 150 },
    { headerName: "Article No", field: "articleNo", width: 100 },
    { headerName: "Color", field: "color", width: 100 },
    { headerName: "Buyer Article No", field: "buyerArticleNo", width: 150 },
    { headerName: "Buyer Article Color", field: "buyerArticleColor", width: 150 },
    { headerName: "Order No.", field: "orderNo", width: 100 },
    { headerName: "Stock No.", field: "stockNo", width: 100 },
    { headerName: "Work Order", field: "workOrder", width: 100 },
    { headerName: "Delivery Date", field: "deliveryDate", width: 120 },
    { headerName: "Size Range", field: "sizeRange", width: 100 },
    { headerName: "Qty", field: "qty", width: 50 },
    { headerName: "Rate", field: "rate", width: 70 },
  ];
  
  return (
    <div className={styles.itemDetailsTableContainer}>
      <div className={styles.inputLinerGrid}>
        <div className={styles.colSpanInputLiner}>
          <div className={styles.itemDetailsInput}>
            {Object.keys(columns).map((key, index) =>
              key !== "deliveryDate" ? (
                <div key={index} className={styles.inputboxScroll}>
                  <input
                    type="text"
                    name={key}
                    className={styles.basicInput}
                    required
                    value={formData[key]}
                    onChange={handleInputChange}
                    style={{ width: columns[key].width }}
                  />
                  <span>{columns[key].label}</span>
                </div>
              ) : null
            )}
            <div className={styles.inputboxScroll}>
              <input
                type="date"
                name="deliveryDate"
                className={styles.basicInput}
                required
                value={formData.deliveryDate}
                onChange={handleInputChange}
                style={{ width: "140px" }}
              />
              <span>Delivery Date</span>
            </div>
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
        </div>{" "}
      </div>

      <div
        className={`ag-theme-quartz ${styles.agThemeQuartz}`}
        style={{width: "100%" }}
      >
        <CustomAgGrid
                rowData={gridData}
                setIsEditing={setIsEditing}
                setRowData={setGridData}
                columnDefs={columnDefs}
                setFormData={setFormData}
                gridHeight="260px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
      </div>
    </div>
  );
};
const PerformaInvoice = () => {
  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Performa Invoice</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>PI No.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="date" className={styles.basicInput} required />
                <span>SR Date</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>SEASON</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>CURRENCY</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>BUYER NAME</span>
              </div>
            </div>
           
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>MODE</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>DISCOUNT</span>
              </div>
            </div>

            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>CONSIGNEE</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>ADDRESS</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>ADDRESS</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>EX-FACTORY TYPE</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>NOTIFY PARTY</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>NOTIFY PARTY</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>PORT OF LOADING</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>VEHICLE NO.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>ADDITIONAL DISC.</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>REMARK FOR DISC.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>PORT OF DISCHARGE</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>DELIVERY TERM</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>DESCRIPTION OF GOODS</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>ADVANCE</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>PAYMENT TERM</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>FINAL DESTINATION</span>
              </div>
            </div>
            <div className={styles.colSpan2}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>REMARK</span>
              </div>
            </div>
           
          </div>
          <div className={styles.headBorder}></div>
        </div>

        <ItemDetails />
      </div>
    </div>
  );
};
export default PerformaInvoice;
