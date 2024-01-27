import React, { useState, useEffect, useCallback,useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import {  formatDDMMYYYYDate } from "../features/convertDate";
import viewStyles from "../styles/viewDetails.module.css";
import { getApiService, postApiService } from "../service/apiService";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllItemRates } from "../reducer/itemRateSlice";

const ItemQuotation = () => {
  const [activeButton, setActiveButton] = useState("details");
  const [itemSelect,setItemSelect] = useState(null);
  const [itemNames, setItemNames] = useState([]);
  const [filteredList, setFilteredList] = useState({
    itemNameList: [],
    suppplierList: [],
  });
  const [itemIds , setItemIds] = useState(null);
  const [supplierId , setSupplierId] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditSelected, setIsEditSelected] = useState(false);
  const [showInputLoading, setShowInputLoading] = useState({
    itemId: false,
    supplierId:false
  });
  const dispatch = useDispatch();
  const { itemRates, loaded, loading, error } = useSelector(
    (state) => state.itemRate
  );
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
    supplierId:false
  });

  const handleItemQuotationChange = (e) => {
    const { name, value } = e.target;

    setItemQuotation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
    
  };
  const [itemQuotation, setItemQuotation] = useState(() => {
    const savedForm = localStorage.getItem("itemQuotation");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          itemId:"",
          supplierId:"",
          rate:"",
          unit:"",
          validUntil:"",
        };
  });
  useEffect(() => {
    localStorage.setItem("itemQuotation", JSON.stringify(itemQuotation));
  }, [itemQuotation]);

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const [gridApi, setGridApi] = useState(null);
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    if (!loaded && !loading) {
 dispatch(fetchAllItemRates());
    }
  }, []);

  useEffect(() => {
    if (gridApi && !loaded && loading) {
      gridApi.showLoadingOverlay();
    }
  }, [ loaded, loading, gridApi]);



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

 
    useEffect(() => {
      if (supplierData.length === 0) {
        getSupplier();
      }
      if (itemNames.length === 0) {
        getNames();
      }
    }, []);
 

  const resetAllFields = () => {
    setItemQuotation({
        itemId:"",
        supplierId:"",
        rate:"",
        unit:"",
        validUntil:"",
    });
   
    localStorage.setItem(
      "itemQuotation",
      JSON.stringify(itemQuotation)
    );
  };
  const handleItemNameChange = async (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setItemQuotation((prevItem) => ({ ...prevItem, itemId: value }));
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
  
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };
  const dateFilterParams = {
    comparator: function(filterLocalDateAtMidnight, cellValue) {
      if (!cellValue) return -1;
      const formattedCellValue = formatDDMMYYYYDate(cellValue);
      const formattedFilterDate = filterLocalDateAtMidnight.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      if (formattedCellValue < formattedFilterDate) {
        return -1;
      } else if (formattedCellValue > formattedFilterDate) {
        return 1;
      }
      return 0;
    }
  };
 
  const columnDefs = [
    { headerName: "Edit",  field:'edit' , maxWidth: 80,  checkboxSelection: true },
    { headerName: "Item Name", field: "itemName", sortable: true, filter: true },
    { headerName: "Supplier", field: "supplierName", sortable: true, filter: true },
    {
      headerName: "Rate (INR)",
      field: "rate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Unit",
      field: "unit",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Validity of Rate",
      field: "validUntil",
      sortable: true,
      valueFormatter: (params) => formatDDMMYYYYDate(params.value),
      filter: "agDateColumnFilter",
      filterParams: dateFilterParams,
    }
    
  ];
  const handleItemQuotationSubmit = async (e)=>{
    e.preventDefault();
    setSubmitLoading(true);
    const updatedItemQuotation = {
      ...itemQuotation,
      itemId: itemIds,
      supplierId: supplierId,
    };
    console.log(updatedItemQuotation);
    const BASE_URL = 'item/createItemQuotation';
    try {
     const response = await postApiService(updatedItemQuotation,BASE_URL)
     togglePopup(response.message);
     fetchAllItemRates();
    } catch (error) {
     if (error.response) {
       togglePopup(
         error.response.data.message ||
           `Server error: ${error.response.status}`
       );
     } else if (error.request) {
       togglePopup("No response received from the server.");
     } else {
       togglePopup(error.message);
     }
    } finally {
     setSubmitLoading(false);
    }
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
 const supplierNameRef = useRef(null);
 const downshiftSupplierName = (
  <Downshift
    onChange={(selectedItem) => {
      if (selectedItem) {
        setItemQuotation((prevNewItem) => ({
          ...prevNewItem,
          supplierId: selectedItem.supplierName,
        }));
        setSupplierId(selectedItem.supplier_id);
        toggleSuggestVisibility("supplierId", false);
      }
    }}
    itemToString={(item) => (item ? item : "")}
    selectedItem={itemQuotation.supplierId}
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
          value={itemQuotation.supplierId}
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





 const itemNameRef = useRef(null);
const downshiftItemName = (
  <Downshift
    onChange={(selectedItem) => {
      if (selectedItem) {
        setItemQuotation((prevNewItem) => ({
          ...prevNewItem,
          itemId: selectedItem.itemName,
        }));
        setItemIds(selectedItem.itemId);
        toggleSuggestVisibility("itemId", false);
       
      }
    }}
    itemToString={(item) => (item ? item : "")}
    selectedItem={itemQuotation.itemId}
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
          value={itemQuotation.itemId}
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
  return (
    <div className={styles.itemQuotationContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1 className={styles.headText}>Item Quotation </h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Add Item Rates
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "view" ? styles.active : ""
              }`}
               onClick={() => {
                  setActiveButton("view");
                  {
                    !isCollapsed && toggleNavbar();
                  }
                }}
            >
              View Item Rates
            </button>
          </div>
          {activeButton === "view" && (
              <div className={styles.editContainer}>
                <button
                  disabled={!isEditSelected}
                  className={styles.headButton}
                  
                >
                  Update
                </button>
              </div>
            )}
             </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          {" "}
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="input1">
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
                <label className={styles.sampleLabel} htmlFor="input1">
                  Rate
                </label>
                <input
                  type="number"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.rate}
                  name="rate"
                  onChange={handleItemQuotationChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                  Unit
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.unit}
                  name="unit"
                  onChange={handleItemQuotationChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="input1">
                 Valid Until
                </label>
                <input
                  type="date"
                  className={styles.basicInput}
                  placeholder="Name"
                  value={itemQuotation.validUntil}
                  name="validUntil"
                  onChange={handleItemQuotationChange}
                />
              </div>
            </div>{" "}
          </div>
          <div className={styles.parentButtonContainer}>
          {submitLoading ? (
          <div className={styles.buttonContainer}>
            <div className={styles.loader}></div>
          </div>
        ) : (
          <div className={styles.buttonContainer}>
            <button className={styles.resetButton} onClick={resetAllFields}>
              Reset
            </button>
            <button
              className={styles.submitButton}
              onClick={handleItemQuotationSubmit}
            >
              Submit
            </button>
          </div>
        )}    
</div>
        {isPopupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.popupContent}>
                <h2>{popupMessage}</h2>
                <button className={styles.popupButton} onClick={togglePopup}>
                  OK
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        
        <div
        className={isCollapsed ? viewStyles.topContainer : viewStyles.topContainerOpen}
      >
      
          <div
            className={`ag-theme-quartz ${viewStyles.agThemeQuartz}`}
            style={{ height: 500, width: "100%", marginTop: "10px" }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={itemRates}
              pagination={true}
              paginationPageSize={12}
              paginationPageSizeSelector={[10, 12, 20, 50, 100]}
              animateRows={true}
              filter={true}
              onGridReady={onGridReady}

            />
          </div>
      </div>
      )}
    </div>
  );
};

export default ItemQuotation;
