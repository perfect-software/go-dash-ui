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
import { CustomHeader } from "../../helper/print";
const GraphAverage = ({
  bomData,
  setBomData,
  editDetails,
  setEditDetails,
  resetTrigger,
  onResetDone,
  selectedData,
}) => {
  const [itemNames, setItemNames] = useState([]);
  const dispatch = useDispatch();
  const { isCollapsed } = useSidebar();
  const [supplierId, setSupplierId] = useState(null);
  const [itemIds, setItemIds] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const initialValidationState = {};
  const [isRatePopup, setIsRatePopup] = useState(false);
  const [validation, setValidation] = useState(initialValidationState);
  const [selectionStates, setSelectionStates] = useState({});
  const [filteredList, setFilteredList] = useState({
    itemNameList: [],
    suppplierList: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
    supplierId: false,
  });
  const [showInputLoading, setShowInputLoading] = useState({
    itemId: false,
    supplierId: false,
  });
  const [newItem, setNewItem] = useState({
    supplierId: { name: "", id: "" },
    itemId: { name: "", id: "" },
  });
  const { itemRates, loadedRate, loadingRate, errorRate } = useSelector(
    (state) => state.itemRate
  );

  useEffect(() => {
    if (!loadedRate && !loadingRate) {
      dispatch(fetchAllItemRates());
    }
  }, [loadedRate, loadingRate, dispatch]);

  const handleRateSubmit = (selectedRates) => {
    if (Array.isArray(selectedRates) && selectedRates.length > 0) {
      const selectedRate = selectedRates[0];
      setNewItem((prevItem) => ({
        ...prevItem,
        itemId: {
          ...prevItem.itemId,
          name: selectedRate.itemName,
          id: selectedRate.itemId,
        },
        supplierId: {
          ...prevItem.supplierId,
          name: selectedRate.supplierName,
          id: selectedRate.supplierId,
        },
      }));
      toggleSuggestVisibility("itemId", false);
      setIsRatePopup(false);
    }
  };

  useEffect(() => {
    if (resetTrigger) {
      setBomData({
        groups: [],
      });
      onResetDone();
      setValidation(initialValidationState);
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);

  useEffect(() => {
    if (selectedData) {
      console.log(selectedData);
    }
  }, [selectedData]);

  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = ["itemId", "supplierId"];

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

  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

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
    const filteredItems = supplierData
      .filter((supplier) =>
        supplier.supplierName.toLowerCase().includes(value.toLowerCase())
      )
      .map((supplier) => ({
        supplier_id: supplier.supplier_id,
        supplierName: supplier.supplierName,
      }));

    setFilteredList((prevState) => ({
      ...prevState,
      suppplierList: filteredItems,
    }));
    toggleInputLoaderVisibility(`${name}`, false);
    toggleSuggestVisibility(name, value.length > 0);
  };
  const handleOnSupplierChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      supplierId: {
        ...prevItem.supplierId,
        name: value,
      },
    }));
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const handleItemNameChange = async (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
    setNewItem((prevItem) => ({
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
      }));
    setItemNames(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const downshiftItemName = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setNewItem((prevItem) => ({
            ...prevItem,
            itemId: {
              ...prevItem.itemId,
              name: selectedItem.itemName,
              id: selectedItem.itemId,
            },
            supplierId: {
              ...prevItem.supplierId,
              name: selectedItem.supplierName,
              id: selectedItem.supplierId,
            },
          }));
          console.log(newItem);
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
            style={
              validation.itemId === "invalid" ? { border: "2px solid red" } : {}
            }
            placeholder="Type a word"
            value={newItem.itemId.name}
          />
          {showInputLoading.itemId ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => setIsRatePopup(true)}
              className={tableStyles.searchBtn2}
              aria-label="Search"
            ></button>
          )}

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

  const columnDefs = [
    {
      headerName: "Select",
      field: "edit",
      maxWidth: 100,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      showDisabledCheckboxes: true,
    },
    { headerName: "S#", field: "id", width: 100, sortable: true, filter: true },
    {
      headerName: "Morder No",
      field: "value",
      width: 150,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Item Name",
      field: "itemName",
      width: 160,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Req. Qty",
      field: "requiredQuantity",
      width: 120,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Del. Date",
      field: "deliveryDate",
      width: 260,
      sortable: true,
      filter: true,
      headerComponent: CustomHeader,
    },
    {
      headerName: "Ex Factory Date",
      field: "exFactoryDate",
      width: 180,
      sortable: true,
      filter: true,
      headerComponent: CustomHeader,
    },
    {
      headerName: "Qty",
      field: "quantity",
      width: 100,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Rate",
      field: "rate",
      width: 100,
      sortable: true,
      filter: true,
    },
   
    {
      headerName: "Remark",
      field: "remark",
      width: 200,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Sup. Del. Date",
      field: "supplementaryDeliveryDate",
      width: 150,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Show Size",
      field: "showSize",
      width: 120,
      sortable: true,
      filter: true,
    },
  ];

  return (
    <>
      <div className={styles.purchaseTopGrid}>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="itemId">
            Item Name
          </label>
          {downshiftItemName}
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="supplierId">
            Supplier
          </label>
          <input
            name="supplierId"
            type="text"
            onChange={handleOnSupplierChange}
            style={
              validation.supplierId === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            className={styles.basicInput}
            placeholder="Enter supplier"
            value={newItem.supplierId.name}
          />
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
      <>
        <div
          className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
          style={{ height: 250, width: "100%", marginTop: "10px" }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={selectedData && selectedData}
            pagination={true}
            paginationPageSize={12}
            paginationPageSizeSelector={[10, 12, 20, 50, 100]}
            animateRows={true}
            rowSelection={"multiple"}
            //  onSelectionChanged={onRowSelected}
            filter={true}

            //  onGridReady={onGridReady}
            //  overlayLoadingTemplate={
            //     '<span class="ag-overlay-loading-center">Loading...</span>'
            //   }
            //   overlayNoRowsTemplate={
            //     `<span class="ag-overlay-loading-center">${fetchError ? 'Failed to load data' : 'No data found'}</span>`
            //   }
          />
        </div>
      </>
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
