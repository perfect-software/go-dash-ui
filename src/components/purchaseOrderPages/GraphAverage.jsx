import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import tableStyles from "../../styles/bom.module.css";
import Downshift from "downshift";
import { useSelector, useDispatch } from "react-redux";
import { getformatDate } from "../../features/convertDate";
import { fetchItemGroupsAndSubGroups } from "../../reducer/grpSubgrpSlice";
import { useSidebar } from "../../context/SidebarContext";
import { getApiService } from "../../service/apiService";
import { fetchAllItemRates } from "../../reducer/itemRateSlice";
import ItemRatesPopup from "../../popups/ItemRatesPopup";

const GraphAverage = ({ bomData, setBomData ,editDetails, setEditDetails, resetTrigger, onResetDone }) => {
  const [itemNames, setItemNames] = useState([]);
  const { isCollapsed } = useSidebar();
  const [supplierId , setSupplierId] = useState(null);
  const [itemIds , setItemIds] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const initialValidationState = {};
  const [isRatePopup, setIsRatePopup] = useState(false);
  const [validation, setValidation] = useState(initialValidationState);
  const [selectionStates, setSelectionStates] = useState({
  
  });
  const [filteredList, setFilteredList] = useState({
    itemNameList: [],
    suppplierList: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
    supplierId:false
  
  });
  const [showInputLoading, setShowInputLoading] = useState({
    itemId: false,
    supplierId:false
  
  });
  const [newItem, setNewItem] = useState({
    itemId:"",
    supplierId:"",
  });

  useEffect(() => {
    if (resetTrigger) {
      setBomData({
        groups: []
    });
      onResetDone(); 
      setValidation(initialValidationState);
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);



  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = [
      "itemId",
      "supplierId",
   
    ];

    if (!newItem.itemId.name.trim() || !selectionStates.itemId) {
      isValid = false;
      newValidation["itemId"] = "invalid";
    } else {
      newValidation["itemId"] = "valid";
    }
   

    setValidation(newValidation);
    return isValid;
  };



  const resetNewItemState = () => {
    setNewItem({
  
      itemId: { name: "", id: "" },
      supplierId: { name: "", id: "" },
     
    });
  };

  const getSupplier = async () => {
    const BASE_URL = "supplier/getSupplierList";
    try {
      const response = await getApiService(BASE_URL);
      setSupplierData(response);
    } catch (error) {
      console.error("Failed to fetch Supplier:", error);
    }
  };
  const getNames = async () => {
    const BASE_URL = "item/getItemName";
    try {
      const response = await getApiService(BASE_URL);
      setItemNames(response);
    } catch (error) {
      console.error("Failed to fetch Supplier:", error);
    }
  };
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
    
  };
  useEffect(() => {
    if (supplierData.length === 0) {
      getSupplier();
    }
    if (itemNames.length === 0) {
      getNames();
    }
  }, []);
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const handleButtonClick = (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    if (name === "itemId") {
      setFilteredList({ ...filteredList, itemNameList: itemNames });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }
    if (name === "supplierId") {
      setFilteredList({ ...filteredList, suppplierList: supplierData });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }
    toggleInputLoaderVisibility(`${name}`, false);
  };
  const handleSupplierChange = async (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setItemQuotation((prevItem) => ({ ...prevItem, supplierId: value }));
    const filteredItems = supplierData.filter((supplier) =>
    supplier.supplierName.toLowerCase().includes(value.toLowerCase())
  ).map(supplier => ({ supplier_id: supplier.supplier_id, supplierName: supplier.supplierName }));

    setFilteredList((prevState) => ({
      ...prevState,
      suppplierList: filteredItems,
    }));
    toggleInputLoaderVisibility(`${name}`, false);
    toggleSuggestVisibility(name, value.length > 0);
  };
  const handleItemNameChange = async (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setNewItem((prevItem) => ({ ...prevItem, itemId: value }));
    const filteredItems = itemNames.filter((item) =>
    item.itemName.toLowerCase().includes(value.toLowerCase())
  ).map(item => ({ itemId: item.itemId, itemName: item.itemName }));
    setFilteredList((prevState) => ({
      ...prevState,
      itemNameList: filteredItems,
    }));
    toggleInputLoaderVisibility(`${name}`, false);
    toggleSuggestVisibility(name, value.length > 0);
  };
  const itemNameRef = useRef(null);
const downshiftItemName = (
  <Downshift
    onChange={(selectedItem) => {
      if (selectedItem) {
        setNewItem((prevNewItem) => ({
          ...prevNewItem,
          itemId: selectedItem.itemName,
        }));
        setItemIds(selectedItem.itemId);
        toggleSuggestVisibility("itemId", false);
       
      }
    }}
    itemToString={(item) => (item ? item : "")}
    selectedItem={newItem.itemId}
  >
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      isOpen,
      highlightedIndex,
    }) => (
      <div className={styles.inputWithIcon}>
        <input
          {...getInputProps({
            onChange: handleItemNameChange,
            name: "itemId",
          })}
          type="text"
          className={styles.basicInput}
          //style={validation.itemId === 'invalid' ? { border: "2px solid red" } : {}}
          placeholder="Type a word"
          value={newItem.itemId}
        />
              {showInputLoading.itemId ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("itemId");
              itemNameRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>


          )}
       
         <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.itemId &&
              filteredList.itemNameList.map((items, index) => (
                <div
                  {...getItemProps({ key: index, index, item: items })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {items.itemName}
                </div>
              ))}
          </div>
      </div>
    )}
  </Downshift>
);

const supplierNameRef = useRef(null);
const downshiftSupplierName = (
 <Downshift
   onChange={(selectedItem) => {
     if (selectedItem) {
       setNewItem((prevNewItem) => ({
         ...prevNewItem,
         supplierId: selectedItem.supplierName,
       }));
       setSupplierId(selectedItem.supplier_id);
       toggleSuggestVisibility("supplierId", false);
     }
   }}
   itemToString={(item) => (item ? item : "")}
   selectedItem={newItem.supplierId}
 >
   {({
     getInputProps,
     getItemProps,
     getMenuProps,
     isOpen,
     highlightedIndex,
   }) => (
     <div className={styles.inputWithIcon}>
       <input
         {...getInputProps({
           onChange: handleSupplierChange,
           name: "supplierId",
         })}
         type="text"
         className={styles.basicInput}
         //style={validation.supplierId === 'invalid' ? { border: "2px solid red" } : {}}
         placeholder="Type a word"
         value={newItem.supplierId}
       />
       {showInputLoading.supplierId ? (
           <div className={styles.dropLoader}></div>
         ) : (
           <button
           onClick={() => {
             handleButtonClick("supplierId");
             supplierNameRef.current?.focus();
           }}
           className={styles.dropBtn}
           aria-label="dropDorn"
         ></button>


         )}
       
        <div {...getMenuProps()} className={styles.suggestions}>
           {showSuggestions.supplierId &&
             filteredList.suppplierList.map((items, index) => (
               <div
                 {...getItemProps({ key: index, index, item: items })}
                 className={
                   highlightedIndex === index
                     ? styles.highlighted
                     : styles.suggestionItem
                 }
               >
                 {items.supplierName}
               </div>
             ))}
         </div>
     </div>
   )}
 </Downshift>
);

  
  return (
    <>
      <div className={styles.topGrid}>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="itemId">
            Item Name
          </label>
          {downshiftItemName}
        </div>
        <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Supplier
                </label>
               {downshiftSupplierName}
              </div>
        <div className={styles.colSpan}>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddMaterial();
            }}
            className={tableStyles.addBtn}
            aria-label="Search"
          >
            {" "}
            ADD{" "}
          </button>
        </div>
      </div>

       <div className={isCollapsed ? tableStyles.tableBor : tableStyles.tableBorOpen}>
        <table className={tableStyles.customTable}>
          <thead>
            <tr>
              <th>S No.</th>
              <th>Morder No.</th>
              <th style={{maxWidth:'200px'}}>Item Name</th>
              <th>Req Qty</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Del. Date</th>
              <th>Ex Factory Date</th>
              <th style={{maxWidth:'100px'}}>Remark</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          {/* <tbody>{renderTableBody()}</tbody> */}
        </table>
      </div> 

      {isRatePopup && (
        <ItemRatesPopup
          onCancel={() => {
            setIsRatePopup(false);
          }}
          onSubmitRateData={handleRateSubmit}
        />
      )}
    </>
  );
};

export default GraphAverage;
