import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Downshift from "downshift";
import { useSelector, useDispatch } from "react-redux";
import tableStyles from "../../styles/bom.module.css";
import SizePlanPopup from "../../popups/SizePlanPopup";
import { fetchAllItemRates } from "../../reducer/itemRateSlice";
import ItemRatesPopup from "../../popups/ItemRatesPopup";
import { fetchItemGroupsAndSubGroups } from "../../reducer/grpSubgrpSlice";

const Grading = ({ productionBomData, setProductionBomData ,editDetails, setEditDetails, resetTrigger, onResetDone }) => {
  const [showSuggestions, setShowSuggestions] = useState({
    sizePlan: false,
    itemId: false,
    itemgrp: false,
    itemsubgrp: false,
  });
  const [rowData, setRowData] = useState([]);
  const [isSizePlanPopup, setIsSizePlanPopup] = useState(false);
  const [newItem, setNewItem] = useState({
    itemgrp: { name: "", id: "" },
    itemsubgrp: { name: "", id: "" },
    itemId: { name: "", id: "" },
    sizePlan:"",
    quantity:"",
    rangeFrom:"",
    rangeTo:"",
    total:"",
  });
  const [itemNames, setItemNames] = useState([]);
  const [total,setTotal] = useState(null);
  const [showInputLoading, setShowInputLoading] = useState({
    sizePlan: false,
    itemId: false,
    itemgrp: false,
    itemsubgrp: false,
  });
  const resetNewItemState = () => {
    setNewItem({
      itemgrp: { name: "", id: "" },
      itemsubgrp: { name: "", id: "" },
      itemId: { name: "", id: "" },
      sizePlan: "",
      quantity: "",
      rangeFrom: "",
      rangeTo: "",
      total: "",
    });
  };
  useEffect(() => {
    if (resetTrigger) {
      setProductionBomData({ grading: [] });
      onResetDone();
      resetNewItemState();
    }
  }, [resetTrigger, onResetDone]);
  const [isRatePopup, setIsRatePopup] = useState(false);
  const dispatch = useDispatch();
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const { itemRates, loadedRate, loadingRate, errorRate } = useSelector(
    (state) => state.itemRate
  );
  const { itemGroups, itemSubGroups, loaded, loading, error } = useSelector(
    (state) => state.data
  );

  useEffect(() => {
    if (!loaded && !loading) {
    dispatch(fetchItemGroupsAndSubGroups());
    }

  }, [loaded, loading, dispatch]);
  const [filteredList, setFilteredList] = useState({
    itemGrpList: [],
    itemSubGrpList: [],
  });
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
      }));
    setItemNames(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
  
  };
  const handleGrpButtonClick = (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
    if (name === "itemgrp") {
      setFilteredList({ ...filteredList, itemGrpList: itemGroups });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }

    if (name === "itemsubgrp") {
      const filtered = Object.entries(itemSubGroups)
        .filter(
          ([key, subGroupDetails]) =>
            subGroupDetails.groupNumber.toLowerCase() ===
            itemGroupNumber.toLowerCase()
        )
        .reduce((acc, [key, subGroupDetails]) => {
          acc[key] = subGroupDetails.name;
          return acc;
        }, {});

      setFilteredList({ ...filteredList, itemSubGrpList: filtered });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }
    toggleInputLoaderVisibility(`${name}`, false);
   // setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  useEffect(() => {
    if (!loadedRate && !loadingRate) {
      dispatch(fetchAllItemRates());
    }
  }, [loadedRate, loadingRate, dispatch]);

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const [selectionStates, setSelectionStates] = useState({
    itemsubgrp: false,
    itemgrp: false,
  });
  const columnDefs = useMemo(
    () => [
      { field: "code", headerName: "Code" },
      { field: "itemId.name", headerName: "Item description",width:350 },
      { field: "quantity", headerName: "Quantity" },
      { field: "sizePlan", headerName: "Size Plan" },
      { field: "itemsubgrp.name", headerName: "Subgroup Name" },
      { field: "total", headerName: "Req. Qunatity" },
      {
        field: "action",
        headerName: "Action",
        cellStyle: { textAlign: "center" },
        cellRenderer: function (params) {
          return (
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                className={tableStyles.minus}
                onClick={() => handleRemoveItem(params.data.code)}
              ></button>
            </div>
          );
        },
      },
    ],
    []
  );
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
      }));

      toggleSuggestVisibility("itemId", false);
      setIsRatePopup(false);
    }
  };

  const data = [
    { size: 31, qty: 113, sole: 31, n: 31, extra: 2 },
    { size: 32, qty: 113, sole: 32, n: 32, extra: 2 },
    { size: 33, qty: 113, sole: 33, n: 33, extra: 2 },
    { size: 34, qty: 150, sole: 34, n: 34, extra: 3 },
    { size: 35, qty: 225, sole: 35, n: 35, extra: 5 },
    { size: 36, qty: 225, sole: 36, n: 36, extra: 5 },
    { size: 37, qty: 225, sole: 37, n: 37, extra: 5 },
    { size: 38, qty: 113, sole: 38, n: 38, extra: 2 },
    { size: 39, qty: 113, sole: 39, n: 39, extra: 2 },
    { size: 40, qty: 113, sole: 40, n: 40, extra: 2 },
  ];
  
  const getQuantityBySizeRange =(minSize, maxSize) => {
    console.log(minSize,maxSize);
    const matchingItems = data.filter(item => item.size >= minSize && item.size <= maxSize);
    const totalQuantity = matchingItems.reduce((acc, item) => acc + item.qty, 0);
    setNewItem({...newItem,total:totalQuantity*newItem.quantity});
    return totalQuantity*newItem.quantity;
  }


  const handleAddMaterial = () => {
    setProductionBomData((prevData) => {
      const updatedProduction = Array.isArray(prevData.grading) ? [...prevData.grading, newItem] : [newItem];
      return {
        ...prevData,
        grading: updatedProduction,
      };
    });
    resetNewItemState();
  };
  const handleSizeSubmit = (selectedSizes) => {
    if (Array.isArray(selectedSizes) && selectedSizes.length > 0) {
      const selectedSize = selectedSizes[0];
      console.log(selectedSize);
      setNewItem((prevItem) => ({
        ...prevItem,
         sizePlan: selectedSize.code,
         rangeFrom: selectedSize.from,
         rangeTo:selectedSize.to
        
      }));
    //  setTotal(getQuantityBySizeRange(newItem.rangeFrom&&newItem.rangeFrom, newItem.rangeTo&&newItem.rangeTo));
      toggleSuggestVisibility("itemId", false);
      setIsSizePlanPopup(false);
    }

  };
  useEffect(() => {
    let timeoutId;

    if (newItem.rangeFrom && newItem.rangeTo) {
      timeoutId = setTimeout(() => {
        setTotal(getQuantityBySizeRange(newItem.rangeFrom, newItem.rangeTo));
     
      }, 1000); // 5-second delay
    }

    return () => clearTimeout(timeoutId); // Cleanup function
  }, [newItem.rangeFrom, newItem.rangeTo]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleRemoveItem = (code) => {
    setProductionBomData((prevData) => {
      const updatedProduction = Array.isArray(prevData.grading) ? prevData.grading.filter((item) => item.code !== code) : [];
      return {
        ...prevData,
        grading: updatedProduction,
      };
    });
  };
  const updateSelectionState = (itemName, isSelected) => {
    setSelectionStates((prevStates) => ({
      ...prevStates,
      [itemName]: isSelected,
    }));
  };
  const handleGrpItemChange = (e) => {
    const { name, value } = e.target;
    updateSelectionState(name, false);
    toggleInputLoaderVisibility(`${name}`, true);
    if (name === "itemgrp") {
      setNewItem({ ...newItem, itemgrp: { ...newItem.itemgrp, name: value } });
      const filtered = Object.entries(itemGroups)
        .filter(([key, groupName]) =>
          groupName.toLowerCase().includes(value.toLowerCase())
        )
        .reduce((acc, [key, groupName]) => {
          acc[key] = groupName;
          return acc;
        }, {});

      setFilteredList({ ...filteredList, itemGrpList: filtered });
      toggleSuggestVisibility(name, value.length > 0);
    }
    if (name === "itemsubgrp") {
      setNewItem({
        ...newItem,
        itemsubgrp: { ...newItem.itemsubgrp, name: value },
      });
      const filtered = Object.entries(itemSubGroups)
        .filter(
          ([key, subGroupDetails]) =>
            subGroupDetails.name.toLowerCase().includes(value.toLowerCase()) &&
            subGroupDetails.groupNumber.toLowerCase() ===
              itemGroupNumber.toLowerCase()
        )
        .reduce((acc, [key, subGroupDetails]) => {
          acc[key] = subGroupDetails.name;
          return acc;
        }, {});

      setFilteredList({ ...filteredList, itemSubGrpList: filtered });

      toggleSuggestVisibility(name, value.length > 0);
    }
    toggleInputLoaderVisibility(`${name}`, false);
   // setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const downshiftSizePlan = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          //  toggleSuggestVisibility("itemId", false);
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={newItem.sizePlan}
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
              onChange: handleInputChange,
              name: "sizePlan",
            })}
            disabled={!newItem.quantity}
            type="text"
            className={styles.basicInput}
            // style={
            //   validation.sizePlan === "invalid" ? { border: "2px solid red" } : {}
            // }
            placeholder="Type a word"
            value={newItem.sizePlan}
          />
          {showInputLoading.sizePlan ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => setIsSizePlanPopup(true)}
              className={tableStyles.searchBtn2}
              disabled={!newItem.quantity}
              aria-label="Search"
            ></button>
          )}

          {/* <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.sizePlan &&
              itemNames.map((name, idx) => (
                <div
                  {...getItemProps({ key: idx, index: idx, item: name })}
                  className={
                    highlightedIndex === idx
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {}
                </div>
              ))}
          </div> */}
        </div>
      )}
    </Downshift>
  );

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
            // style={
            //   validation.itemId === "invalid" ? { border: "2px solid red" } : {}
            // }
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
  const itemGrpRef = useRef(null);
  const downshiftItemGrp = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setNewItem((prevNewItem) => ({
            ...prevNewItem,
            itemgrp: { id: selectedItem.id, name: selectedItem.name },
          }));
          setItemGroupNumber(selectedItem.id);
          updateSelectionState("itemgrp", true);
          toggleSuggestVisibility("itemgrp", false);
        }
      }}
      selectedItem={newItem.itemgrp}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleGrpItemChange,
              name: "itemgrp",
            })}
            type="text"
            ref={itemGrpRef}
            className={styles.basicInput}
            // style={
            //   validation.itemgrp === "invalid"
            //     ? { border: "2px solid red" }
            //     : {}
            // }
            placeholder="Insert First Letter"
            value={newItem.itemgrp.name}
          />

          {showInputLoading.itemgrp ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleGrpButtonClick("itemgrp");
                itemGrpRef.current?.focus();
              }}
              className={tableStyles.searchBtn}
              aria-label="dropDorn"
            ></button>
          )}

          {showSuggestions.itemgrp && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {Object.entries(filteredList.itemGrpList).map(
                ([key, name], index) => (
                  <div
                    key={key}
                    {...getItemProps({
                      item: { id: key, name: name },
                      index: index,
                    })}
                    className={
                      highlightedIndex === index
                        ? styles.highlighted
                        : styles.suggestionItem
                    }
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
  const itemSubGrpRef = useRef(null);
  const downshiftItemSubGrp = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setNewItem((prevNewItem) => ({
            ...prevNewItem,
            itemsubgrp: { id: selectedItem.id, name: selectedItem.name },
          }));
          toggleSuggestVisibility("itemsubgrp", false);
          updateSelectionState("itemsubgrp", true);
        }
      }}
      selectedItem={newItem.itemsubgrp}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleGrpItemChange,
              name: "itemsubgrp",
            })}
            type="text"
            ref={itemSubGrpRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            // style={
            //   validation.itemsubgrp === "invalid"
            //     ? { border: "2px solid red" }
            //     : {}
            // }
            disabled={!newItem.itemgrp.name}
            value={newItem.itemsubgrp.name}
         
          />

          {showInputLoading.itemsubgrp ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleGrpButtonClick("itemsubgrp");
                itemSubGrpRef.current?.focus();
              }}
              className={tableStyles.searchBtn}
              disabled={!newItem.itemgrp.name}
              aria-label="dropDorn"
            ></button>
          )}

          {showSuggestions.itemsubgrp && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {Object.entries(filteredList.itemSubGrpList).map(
                ([key, name], index) => (
                  <div
                    key={key}
                    {...getItemProps({
                      item: { id: key, name: name },
                      index: index,
                    })}
                    className={
                      highlightedIndex === index
                        ? styles.highlighted
                        : styles.suggestionItem
                    }
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
  return (
    <>
      <div className={styles.topGrid}>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Item Name
          </label>
          {downshiftItemName}
        </div>
        <div className={styles.colSpan2}>
          <label className={styles.impsampleLabel} htmlFor="itemgrp">
            Group
          </label>
          {downshiftItemGrp}
        </div>
        <div className={styles.colSpan2}>
          <label className={styles.impsampleLabel} htmlFor="itemsubgrp">
            Sub Group
          </label>
          {downshiftItemSubGrp}
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Quantity
          </label>
          <input
            name="quantity"
            type="number"
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.quantity}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Size Plan
          </label>
          {downshiftSizePlan}
        </div>
        <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="code">
                 Total
                </label>
                <input
                 disabled
                  type="text"
                  name="code"
                  value={total&&total}
                 // onChange={handleInputChange}
                  placeholder="Total Here"
                  className={styles.basicInput}
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

      <div
        className={`ag-theme-quartz ${tableStyles.agThemeQuartz}`}
        style={{ height: 250, width: "100%", marginTop: "10px" }}
      >
        <AgGridReact rowData={productionBomData.grading} columnDefs={columnDefs} overlayNoRowsTemplate={
            `<span class="ag-overlay-loading-center">No data found</span>`
          } />
      </div>
      {isSizePlanPopup && (
        <SizePlanPopup
          onCancel={() => {
            setIsSizePlanPopup(false);
          }}
          onSubmitSizeData={handleSizeSubmit}
        />
      )}
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

export default Grading;
