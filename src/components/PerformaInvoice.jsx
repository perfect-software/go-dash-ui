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
    if (editIndex !== null) {
      const updatedGridData = [...gridData];
      updatedGridData[editIndex] = { ...formData };
      setGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setGridData([...gridData, { ...formData }]);
    }
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

  const handleDeleteRow = (id) => {
    const updatedGridData = gridData.filter((item) => item.id !== id);
    setGridData(updatedGridData);
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
        style={{ height: 500, width: "100%" }}
      >
        <AutoTable
          columns={columns}
          data={gridData}
          setData={setGridData}
          canEdit={true}
          canDelete={true}
          setFormData={setFormData}
          setIsEditing={setIsEditing}
          setEditIndex={setEditIndex}
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
