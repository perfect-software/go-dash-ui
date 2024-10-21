import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/newPo.module.css";
import { Country, State, City } from "country-state-city";
import Currencydata from "currency-codes/data";
import Edit3dIcon from "../assets/edit3d.svg";
import Delete3dIcon from "../assets/delete3d.svg";
import UpIcon from "../assets/up.svg";
import IButtonIcon from "../assets/iButton.svg";
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
import CustomAgGrid from "../features/CustomAgGrid";
import { v4 as uuidv4 } from "uuid";
import InfoPopup from "../popups/InfoPopup";
// const EditableCell = ({ value, onValueChange, isEditable = true }) => {
//   const [editing, setEditing] = useState(false);
//   const [inputValue, setInputValue] = useState(value);

//   const handleFocus = (event) => event.target.select();

//   const handleChange = (event) => {
//     setInputValue(event.target.value);
//   };

//   const handleBlur = () => {
//     setEditing(false);
//     onValueChange(inputValue);
//   };

//   return isEditable ? (
//     editing ? (
//       <input
//         type="text"
//         value={inputValue}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         autoFocus
//         onFocus={handleFocus}
//         className={styles.customTableInput}
//       />
//     ) : (
//       <div onClick={() => setEditing(true)} className={styles.cell}>
//         {value}
//       </div>
//     )
//   ) : (
//     <div className={styles.cell}>{value}</div>
//   );
// };

const ItemDetails = ({ handleButtonClick, setActivePage }) => {
  const { isCollapsed } = useSidebar();
  const dispatch = useDispatch();
  const [itemNames, setItemNames] = useState([]);
  const { itemRates, loadedRate, loadingRate, errorRate } = useSelector(
    (state) => state.itemRate
  );
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
  });
  useEffect(() => {
    if (!loadedRate && !loadingRate) {
      dispatch(fetchAllItemRates());
    }
  }, [loadedRate, loadingRate, dispatch]);

  const [formData, setFormData] = useState({
    poType: "",
    docType: "",
    poNo: "",
    itemId: { name: "", id: "" },
    unit: "",
    hsn: "",
    poQty: "",
    balQty: "",
    rate: "",
    qtyFt: "",
    rateFt: "",
    pcs: "",
    cgst: "",
    sgst: "",
    igst: "",
    packet: "",
    size: "",
    work: "",
  });
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
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
    toggleSuggestVisibility(name, value.length > 0);
    const filteredItems = itemRates
      .filter((item) =>
        item.itemName.toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        rate: item.rate,
        unit: item.unit,
      }));
    setItemNames(filteredItems);
  };

  const [gridData, setGridData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const headerNames = [
    { name: "Po Type", field: "poType", width: "65px" },
    { name: "Doc Type", field: "docType", width: "73px" },
    { name: "PO Number", field: "poNo", width: "110px" },
    { name: "Item Name", field: "itemName", width: "270px" },
    { name: "Unit", field: "unit", width: "80px" },
    { name: "HSN Code", field: "hsn", width: "80px" },
    { name: "Bill Qty", field: "poQty", width: "80px" },
    { name: "Bal Qty", field: "balQty", width: "80px" },
    { name: "Rate", field: "rate", width: "80px" },
    { name: "QTY (Ft)", field: "qtyFt", width: "80px" },
    { name: "Rate (Ft)", field: "rateFt", width: "80px" },
    { name: "Pieces", field: "pcs", width: "70px" },
    { name: "CGST", field: "cgst", width: "55px" },
    { name: "SGST", field: "sgst", width: "55px" },
    { name: "IGST", field: "igst", width: "65px" },
    { name: "Item Remark", field: "packet", width: "195px" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedGridData = gridData.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
      setGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setGridData([...gridData, { id: uuidv4(), ...formData }]);
    }
    setFormData({
      id: "",
      poType: "",
      docType: "",
      poNo: "",
      itemId: { name: "", id: "" },
      unit: "",
      hsn: "",
      poQty: "",
      balQty: "",
      rate: "",
      qtyFt: "",
      rateFt: "",
      pcs: "",
      cgst: "",
      sgst: "",
      igst: "",
      packet: "",
      size: "",
      work: "",
    });
  };

  const handleEditItem = (index) => {
    setFormData({ ...gridData[index] });
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedGridData = gridData.filter((_, i) => i !== index);
    setGridData(updatedGridData);
  };

  const handleCancelEdit = () => {
    setFormData({
      poType: "",
      docType: "",
      poNo: "",
      itemId: { name: "", id: "" },
      unit: "",
      hsn: "",
      poQty: "",
      balQty: "",
      rate: "",
      qtyFt: "",
      rateFt: "",
      pcs: "",
      cgst: "",
      sgst: "",
      igst: "",
      packet: "",
      size: "",
      work: "",
    });
    setIsEditing(false);
    setEditIndex(null);
  };

  const [isSizeChecked, setIsSizeChecked] = useState(false);
  const [isWorkChecked, setIsWorkChecked] = useState(false);

  const handleSizeCheckboxChange = () => {
    setIsSizeChecked(!isSizeChecked);
    if (!isSizeChecked) {
      handleButtonClick(formData, "sizeOrder");
      setActivePage("otherDetails");
    }
  };
  useEffect(() => {
    // Preserve checkbox states across navigation
    const storedSizeChecked = localStorage.getItem("isSizeChecked") === "true";
    const storedWorkChecked = localStorage.getItem("isWorkChecked") === "true";
    setIsSizeChecked(storedSizeChecked);
    setIsWorkChecked(storedWorkChecked);
  }, []);

  useEffect(() => {
    localStorage.setItem("isSizeChecked", isSizeChecked);
    localStorage.setItem("isWorkChecked", isWorkChecked);
  }, [isSizeChecked, isWorkChecked]);
  const handleWorkCheckboxChange = () => {
    setIsWorkChecked(!isWorkChecked);
    if (!isWorkChecked) {
      handleButtonClick(formData, "mOrder");
      setActivePage("otherDetails");
    }
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Po Type", field: "poType", width: "65px" },
    { headerName: "Doc Type", field: "docType", width: "73px" },
    { headerName: "PO Number", field: "poNo", width: "130px" },
    { headerName: "Item Name", field: "itemName", width: "150px" },
    { headerName: "Unit", field: "unit", width: "70px" },
    { headerName: "HSN Code", field: "hsn", width: "80px" },
    { headerName: "Bill Qty", field: "poQty", width: "80px" },
    { headerName: "Bal Qty", field: "balQty", width: "70px" },
    { headerName: "Rate", field: "rate", width: "80px" },
    { headerName: "QTY (Ft)", field: "qtyFt", width: "85px" },
    { headerName: "Rate (Ft)", field: "rateFt", width: "85px" },
    { headerName: "Pieces", field: "pcs", width: "75px" },
    { headerName: "CGST", field: "cgst", width: "70px" },
    { headerName: "SGST", field: "sgst", width: "70px" },
    { headerName: "IGST", field: "igst", width: "70px" },
    { headerName: "Item Remark", field: "packet", width: "60px" },

  ];
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
  const defaultColDef = {
    tooltipComponent: "customTooltip",
  };

  return (
    <div className={styles.itemDetailsTableContainer}>
      <div className={styles.inputLinerGrid}>
        <div className={styles.colSpanInputLiner}>
          <div className={styles.itemDetailsInput}>
            {headerNames.map(
              (header, index) =>
                header.field !== "itemName" && (
                  <div key={index} className={styles.inputboxScroll}>
                    <input
                      type="text"
                      name={header.field}
                      className={styles.basicInput}
                      required
                      value={formData[header.field]}
                      onChange={handleInputChange}
                      style={{ width: header.width }}
                    />
                    <span>{header.name}</span>
                  </div>
                )
            )}
            <div className={styles.inputboxScroll} style={{ width: "270px" }}>
              {downshiftItemName}
            </div>
            <div className={styles.checkboxWrapper}>
              <input
                id="cbx-size"
                type="checkbox"
                checked={isSizeChecked}
                onChange={handleSizeCheckboxChange}
              />
              <label className={styles.cbx} htmlFor="cbx-size"></label>
              <label className={styles.lbl} htmlFor="cbx-size">
                Add Size
              </label>
            </div>
            <div
              className={styles.checkboxWrapper}
              style={{ marginLeft: "20px" }}
            >
              <input
                id="cbx-work"
                type="checkbox"
                checked={isWorkChecked}
                onChange={handleWorkCheckboxChange}
              />
              <label className={styles.cbx} htmlFor="cbx-work"></label>
              <label className={styles.lbl} htmlFor="cbx-work">
                Add Work Order
              </label>
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
        </div>
      </div>
      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{  width: "100%" }}
      >
        <CustomAgGrid
           rowData={gridData}
           setIsEditing={setIsEditing}
           setRowData={setGridData}
           columnDefs={columnDefs}
           setFormData={setFormData}
           gridHeight="350px"
           editEnabled={true}
           deleteEnabled={true}
           pagination={false}
        />
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
  sizeColumnDefs,
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
    if (orderType === "mOrder") {
      updatedData = mOrder.map((row) =>
        row.mOrderNo === updatedRow.mOrderNo ? updatedRow : row
      );
      updateMOrder(updatedData);
    } else {
      updatedData = sizeOrder.map((row) =>
        row.size === updatedRow.size ? updatedRow : row
      );
      updateSizeOrder(updatedData);
    }

    fillQuantity(tempBal, orderType);
  };

  const editableColumnDefs = (columnDefs, orderType) => {
    return columnDefs.map((col) => ({
      ...col,
      editable: col.field === "useQty",
      onCellValueChanged: (params) => onCellValueChanged(params, orderType),
    }));
  };

  const mColumnDefsWithTempBal = mColumnDefs.map((col) => {
    if (col.field === "balQty") {
      return {
        ...col,
        headerName: `Bal Qty (${currentBalQty})`,
        editable: false,
      };
    }
    return { ...col };
  });

  const sizeColumnDefsWithTempBal = sizeColumnDefs.map((col) => {
    if (col.field === "balQty") {
      return {
        ...col,
        headerName: `Bal Qty (${currentBalQty})`,
        editable: false,
      };
    }
    return { ...col };
  });

  const mColumnDefsEditable = editableColumnDefs(
    mColumnDefsWithTempBal,
    "mOrder"
  );
  const sizeColumnDefsEditable = editableColumnDefs(
    sizeColumnDefsWithTempBal,
    "sizeOrder"
  );

  const [barcode, setBarcode] = useState("");
  const [dm, setDm] = useState("");
  const [gridData, setGridData] = useState([]);

  const handleAddItem = () => {
    const newItem = { barcode, dm };
    setGridData([...gridData, newItem]);
    setBarcode("");
    setDm("");
  };

  const handleDeleteItem = (index) => {
    const updatedData = gridData.filter((_, i) => i !== index);
    setGridData(updatedData);
  };

  const columnDefs = [
    { headerName: "Barcode", field: "barcode" },
    { headerName: "DM", field: "dm" },
    {
      headerName: "Delete",
      field: "delete",
      width: 70,
      cellRenderer: (params) => (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
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
      <div className={styles.leftGatePassOthersDiv} style={{width:'50%'}}>
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
          style={{  width: "100%" }}
        >
          <CustomAgGrid
                gridHeight="325px"
                rowData={mOrder}
                columnDefs={mColumnDefsEditable}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
                cellChange={true}
                onCellValueChanged={(params) =>
                  onCellValueChanged(params, "mOrder")
                }
              />
        </div>
      </div>
      <div className={styles.rightGatePassOthersDiv} style={{width:'50%'}}>
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
          style={{  width: "100%" }}
        >
         <CustomAgGrid
                gridHeight="325px"
                rowData={sizeOrder}
                columnDefs={sizeColumnDefsEditable}
                editEnabled={false}
                deleteEnabled={false}
                pagination={false}
                cellChange={true}
                onCellValueChanged={(params) =>
                  onCellValueChanged(params, "sizeOrder")
                }
              />
        </div>
      </div>
      
    </div>
  );
};

const Dmtr = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("itemDetails");
  const [selectedPoNo, setSelectedPoNo] = useState("");
  const [autoFillMOrder, setAutoFillMOrder] = useState(false);
  const [tempBal, setTempBal] = useState("");
  const [autoFillSizeOrder, setAutoFillSizeOrder] = useState(false);
  const [selectedSizePoNo, setSelectedSizePoNo] = useState("");
  const [isInfoPopup, setIsInfoPopup] = useState(false);
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
          <h1>DMTR</h1>
          <div>
                  <img
                    src={IButtonIcon}
                    onClick={() => {
                      setIsInfoPopup(true);
                    }}
                    className={styles.ibutton}
                    alt="iButton"
                  />
                </div>
        </div>
        <div className={styles.topContainer}>
          <div className={styles.topGrid}>
            <div className={styles.colSpan3}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Supplier Name</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Invoice No.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="date" className={styles.basicInput} required />
                <span>Invoice Date</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Bility No.</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>Gate GRN</span>
              </div>
            </div>
            <div className={styles.colSpan}>
              <div className={styles.inputbox}>
                <input type="text" className={styles.basicInput} required />
                <span>EWay Bill No.</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.drtrmidDetails}>
          <div className={styles.midDetailsTitle}>
            <div className={styles.toggleButtons}>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "supplier" ? styles.active : ""
                }`}
                onClick={() => setActivePage("supplier")}
              >
                Supplier & Financial Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "itemDetails" ? styles.active : ""
                }`}
                onClick={() => setActivePage("itemDetails")}
              >
                Item Details
              </button>
              <button
                className={`${styles.screenChangeButton} ${
                  activePage === "otherDetails" ? styles.active : ""
                }`}
                onClick={() => setActivePage("otherDetails")}
              >
                Other Details
              </button>
            </div>
          </div>
        </div>
        {activePage === "itemDetails" && (
          <ItemDetails
            handleButtonClick={handleButtonClick}
            setActivePage={setActivePage}
          />
        )}
        {activePage === "supplier" && <SupplierDetails />}
        {activePage === "otherDetails" && (
          <OtherDetails
            tempBal={tempBal}
            selectedPoNo={selectedPoNo}
            selectedSizePoNo={selectedSizePoNo}
            autoFillMOrder={autoFillMOrder}
            setAutoFillMOrder={setAutoFillMOrder}
            autoFillSizeOrder={autoFillSizeOrder}
            setAutoFillSizeOrder={setAutoFillSizeOrder}
            mOrder={mOrder}
            sizeOrder={sizeOrder}
            updateMOrder={updateMOrder}
            updateSizeOrder={updateSizeOrder}
            mColumnDefs={mColumnDefs}
            sizeColumnDefs={sizeColumnDefs}
          />
        )}
      </div>
      {isInfoPopup && (
            <InfoPopup
              onCancel={() => {
                setIsInfoPopup(false);
              }}
              infoName={"DMTR"}
            />
          )}
    </div>
  );
};

export default Dmtr;
