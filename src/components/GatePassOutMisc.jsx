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
import { v4 as uuidv4 } from 'uuid';
const ItemDetails = () => {
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const { itemRates, loadedRate, loadingRate } = useSelector(
    (state) => state.itemRate
  );
  const [itemNames, setItemNames] = useState([]);
  const [formData, setFormData] = useState({
    itemId: { name: "", id: "" },
    unit: "",
    articleNo: "",
    qty: "",
    rate: "",
    hsn: "",
    cgst: "",
    sgst: "",
    igst: "",
    remark: "",
  });
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
  });
  const [gridData, setGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!loadedRate && !loadingRate) {
      dispatch(fetchAllItemRates());
    }
  }, [loadedRate, loadingRate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemNameChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevItem) => ({
      ...prevItem,
      itemId: {
        ...prevItem.itemId,
        name: value,
      },
    }));

    setShowSuggestions({ itemId: value.length > 0 });

    const filteredItems = itemRates.filter((item) =>
      item.itemName.toLowerCase().includes(value.toLowerCase())
    );
    setItemNames(filteredItems);
  };
  const downshiftItemName = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setFormData((prevItem) => ({
            ...prevItem,
            itemId: {
              ...prevItem.itemId,
              name: selectedItem.itemName,
              id: selectedItem.itemId,
            },
          }));
          toggleSuggestVisibility("itemId", false);
        }
      }}
      itemToString={(itemId) => (itemId ? itemId.name : "")}
      selectedItem={formData.itemId}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
      }) => (
        <div className={styles.inputboxScroll}>
          <input
            {...getInputProps({
              onChange: handleItemNameChange,
              name: "itemId",
            })}
            className={styles.basicInput}
            required
            value={formData.itemId.name}
            style={{ width: "270px" }}
          />
          <span>Item Name</span>
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.itemId &&
              itemNames.map((name, idx) => (
                <div
                  {...getItemProps({ key: idx, index: idx, item: name })}
                  className={
                    highlightedIndex === idx
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {name.itemName}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );
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
      itemId: { name: "", id: "" },
      unit: "",
      articleNo: "",
      qty: "",
      rate: "",
      hsn: "",
      cgst: "",
      sgst: "",
      igst: "",
      remark: "",
    });
  };



  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
      itemId: { name: "", id: "" },
      unit: "",
      articleNo: "",
      qty: "",
      rate: "",
      hsn: "",
      cgst: "",
      sgst: "",
      igst: "",
      remark: "",
    });
  };

  const columns = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Item Name", field: "itemId.name", width: 200 },
    { headerName: "Unit", field: "unit", width: 70 },
    { headerName: "Article No", field: "articleNo", width: 100 },
    { headerName: "Qty", field: "qty", },
    { headerName: "Rate", field: "rate",},
    { headerName: "HSN", field: "hsn", },
    { headerName: "CGST", field: "cgst", },
    { headerName: "SGST", field: "sgst", },
    { headerName: "IGST", field: "igst", },
    { headerName: "Remark", field: "remark",  }
  ];
  
  const columnsDef = {
    itemName: { label: "Item Name", path: "itemId.name", width: "150px" },
    unit: { label: "Unit", path: "unit", width: "70px" },
    articleNo: { label: "Article No", path: "articleNo", width: "100px" },
    qty: { label: "Qty", path: "qty", width: "50px" },
    rate: { label: "Rate", path: "rate", width: "70px" },
    hsn: { label: "HSN", path: "hsn", width: "80px" },
    cgst: { label: "CGST", path: "cgst", width: "50px" },
    sgst: { label: "SGST", path: "sgst", width: "50px" },
    igst: { label: "IGST", path: "igst", width: "50px" },
    remark: { label: "Remark", path: "remark", width: "200px" },
  };
  return (
    <div className={styles.itemDetailsTableContainer}>
      <div className={styles.inputLinerGrid}>
        <div className={styles.colSpanInputLiner}>
          <div className={styles.itemDetailsInput}>
            <div className={styles.inputboxScroll} style={{ width: "270px" }}>
              {downshiftItemName}
            </div>

            {Object.keys(columnsDef).map((key, index) =>
              key !== "itemName" ? (
                <div key={index} className={styles.inputboxScroll}>
                  <input
                    type="text"
                    name={key}
                    className={styles.basicInput}
                    required
                    value={formData[key]}
                    onChange={handleInputChange}
                    style={{ width: columnsDef[key].width }}
                  />
                  <span>{columnsDef[key].label}</span>
                </div>
              ) : null
            )}

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
      <div
        className={`ag-theme-quartz ${styles.agThemeQuartz}`}
        style={{ width: "100%" }}
      >
         <CustomAgGrid
                rowData={gridData}
                setIsEditing={setIsEditing}
                setRowData={setGridData}
                columnDefs={columns}
                setFormData={setFormData}
                gridHeight="500px"
                editEnabled={true}
                deleteEnabled={true}
                pagination={true}
              />
      </div>
    </div>
  );
};
const GatePassOutMisc = () => {
  return (
    <div className={styles.pOMainContainer}>
      <div className={styles.pOSubContainer}>
        <div className={styles.titleContainer}>
          <h1>Gate Pass Out (Misc)</h1>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.gateOutTopGrid}>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="date" className={styles.basicInput} required />
                <span>SR Date</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Send To</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Vehicle No.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Sender</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Mode of Transport</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Bearer</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Remark</span>
              </div>
            </div>

            <div className={styles.colSpan}>
              <div className={styles.checkboxWrapper}>
                <input
                  id="cbx-size"
                  type="checkbox"
                  // checked={isSizeChecked}
                  // onChange={handleSizeCheckboxChange}
                />
                <label className={styles.cbx} htmlFor="cbx-size"></label>
                <label className={styles.lbl} htmlFor="cbx-size">
                  Returnable
                </label>
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

export default GatePassOutMisc;
