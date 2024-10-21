import React, { useState, useEffect, useRef, useMemo } from "react";
import styles from "../../styles/inputDetails.module.css";
import styles2 from "../../styles/newPo.module.css";
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
import { v4 as uuidv4 } from 'uuid';
import { fetchAllItemRates } from "../../reducer/itemRateSlice";
import ItemRatesPopup from "../../popups/ItemRatesPopup";
import CustomAgGrid from "../../features/CustomAgGrid";
import CostHeader from "../../features/CostHeader";

const GraphAverage = ({ itemGridData, setItemGridData,productionBomData, setProductionBomData ,editDetails, setEditDetails, resetTrigger, onResetDone }) => {
  const [itemNames, setItemNames] = useState([]);
  const { isCollapsed } = useSidebar();
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const initialValidationState = {};
  const [isRatePopup, setIsRatePopup] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [validation, setValidation] = useState(initialValidationState);
  const [selectionStates, setSelectionStates] = useState({
    itemsubgrp: false,
    itemgrp: false,
  });
  const [filteredList, setFilteredList] = useState({
    itemGrpList: [],
    itemSubGrpList: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
    itemgrp: false,
    itemsubgrp: false,
  });
  const [showInputLoading, setShowInputLoading] = useState({
    itemId: false,
    itemgrp: false,
    itemsubgrp: false,
  });
  const [newItem, setNewItem] = useState({
    itemgrp: { name: "", id: "" },
    itemsubgrp: { name: "", id: "" },
    itemId: { name: "", id: "" },
    usedIn: "",
    pair: "",
    supplierId: { name: "", id: "" },
    bomQty: "",
    unit: "",
    requiredQty: "",
    rate: "",
    cost: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (resetTrigger) {
      setProductionBomData({
        graphAvg: []
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
      "bomQty",
      "unit",
      "requiredQty",
      "rate",
    ];

    if (!newItem.itemgrp.name.trim() || !selectionStates.itemgrp) {
      isValid = false;
      newValidation["itemgrp"] = "invalid";
    } else {
      newValidation["itemgrp"] = "valid";
    }

    if (!newItem.itemsubgrp.name.trim() || !selectionStates.itemsubgrp) {
      isValid = false;
      newValidation["itemsubgrp"] = "invalid";
    } else {
      newValidation["itemsubgrp"] = "valid";
    }
    if (!newItem.supplierId.name.trim()) {
      isValid = false;
      newValidation["supplierId"] = "invalid";
    } else {
      newValidation["supplierId"] = "valid";
    }
    if (!newItem.itemId.name.trim()) {
      isValid = false;
      newValidation["itemId"] = "invalid";
    } else {
      newValidation["itemId"] = "valid";
    }
    requiredFields.forEach((field) => {
      if (!newItem[field]) {
        isValid = false;
        newValidation[field] = "invalid";
      } else {
        newValidation[field] = "valid";
      }
    });

    setValidation(newValidation);
    return isValid;
  };

  const dispatch = useDispatch();
  const { itemGroups, itemSubGroups, loaded, loading, error } = useSelector(
    (state) => state.data
  );


  const { itemRates, loadedRate, loadingRate, errorRate } = useSelector(
    (state) => state.itemRate
  );
  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchItemGroupsAndSubGroups());
    }

  }, [loaded, loading, dispatch]);

  useEffect(() => {
    if (!loadedRate && !loadingRate) {
      dispatch(fetchAllItemRates());
    }
  }, [loadedRate, loadingRate, dispatch]);
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const updateSelectionState = (itemName, isSelected) => {
    setSelectionStates((prevStates) => ({
      ...prevStates,
      [itemName]: isSelected,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => {
      let newCost = prev.cost;
      if (name === "rate" || name === "requiredQty") {
        const newRate =
          name === "rate" ? parseFloat(value) || 0 : parseFloat(prev.rate) || 0;
        const newRequiredQty =
          name === "requiredQty"
            ? parseFloat(value) || 0
            : parseFloat(prev.requiredQty) || 0;
        newCost = (newRate * newRequiredQty).toFixed(2);
      }
      return {
        ...prev,
        [name]: value,
        ...(name === "rate" || name === "requiredQty"
          ? { cost: newCost }
          : null),
      };
    });
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
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

        unit: selectedRate.unit,
        rate: selectedRate.rate,
      }));

      toggleSuggestVisibility("itemId", false);
      setIsRatePopup(false);
    }
  };
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
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
        rate: item.rate,
        unit: item.unit,
      }));
    setItemNames(filteredItems);
    toggleInputLoaderVisibility(`${name}`, false);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const handleAddMaterial = () => {
    if (!validateForm()) {
      return;
    }
    if (isEditing) {
      const updatedGridData = itemGridData.map(item =>
        item.id === newItem.id ? { ...newItem } : item
      );
      setItemGridData(updatedGridData);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setItemGridData([...itemGridData, { id: uuidv4(), ...newItem }]);
    }
    setNewItem({
      itemgrp: { name: "", id: "" },
      itemsubgrp: { name: "", id: "" },
      itemId: { name: "", id: "" },
      usedIn: "",
      pair: "",
      supplierId: { name: "", id: "" },
      bomQty: "",
      unit: "",
      requiredQty: "",
      rate: "",
      cost: "",
    });
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 150,
      field: "select",
      headerName: "Select",
    },
    { headerName: "Group", field: "itemgrp.name",},
    { headerName: "Subgroup", field: "itemsubgrp.name" },
    { headerName: "Item Name", field: "itemId.name",   width: 200,},
    { headerName: "Used In", field: "usedIn" },
    { headerName: "Pair", field: "pair" },
    { headerName: "BOM Qty", field: "bomQty" },
    { headerName: "Extra", field: "requiredQty" },
    { headerName: "Rate", field: "rate" },
    { headerName: "Unit", field: "unit" },
    { headerName: "Supplier", field: "supplierId.name" },
    {
      headerName: 'Cost',
      field: 'cost',
      width: 170,
      pinned: 'right',
      valueFormatter: params => {
        const cost = parseFloat(params.value) || 0;
        return cost.toFixed(2);
      },
      cellRenderer: params => {
        const cost = parseFloat(params.value) || 0;
        return `${cost.toFixed(2)}`;
      },
      headerComponent: (params) => <CostHeader api={params.api} />,
    },
    
    
  ];
  
  const resetNewItemState = () => {
    setNewItem({
      itemgrp: { name: "", id: "" },
      itemsubgrp: { name: "", id: "" },
      itemId: { name: "", id: "" },
      usedIn: "",
      pair: "",
      supplierId: { name: "", id: "" },
      bomQty: "",
      unit: "",
      requiredQty: "",
      rate: "",
    });
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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewItem({
      itemgrp: { name: "", id: "" },
      itemsubgrp: { name: "", id: "" },
      itemId: { name: "", id: "" },
      usedIn: "",
      pair: "",
      supplierId: { name: "", id: "" },
      bomQty: "",
      unit: "",
      requiredQty: "",
      rate: "",
      cost: "",
    });
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
            unit: selectedItem.unit,
            rate: selectedItem.rate,
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
            style={
              validation.itemgrp === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
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
            style={
              validation.itemsubgrp === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
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
      <div className={styles.topGridGraph}>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="itemId">
            Item Name
          </label>
          {downshiftItemName}
        </div>

        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="usedIn">
            Used In
          </label>
          <input
            type="text"
            name="usedIn"
            value={newItem.usedIn}
            onChange={handleInputChange}
            placeholder="Used In"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="pair">
            Pair
          </label>
          <input
            type="text"
            name="pair"
            value={newItem.pair}
            onChange={handleInputChange}
            placeholder="Pair"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.impsampleLabel} htmlFor="bomQty">
            BOM Qty
          </label>
          <input
            type="number"
            name="bomQty"
            value={newItem.bomQty}
            onChange={handleInputChange}
            style={
              validation.bomQty === "invalid" ? { border: "2px solid red" } : {}
            }
            placeholder="BOM Qty"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.impsampleLabel} htmlFor="unit">
            Unit
          </label>
          <input
            name="unit"
            type="text"
            onChange={handleInputChange}
            style={
              validation.unit === "invalid" ? { border: "2px solid red" } : {}
            }
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.unit}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.impsampleLabel} htmlFor="requiredQty">
            Extra
          </label>
          <input
            type="text"
            name="requiredQty"
            value={newItem.requiredQty}
            style={
              validation.requiredQty === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            onChange={handleInputChange}
            placeholder="Required Qty"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.impsampleLabel} htmlFor="rate">
            Rate
          </label>
          <input
            name="rate"
            type="number"
            onChange={handleInputChange}
            style={
              validation.rate === "invalid" ? { border: "2px solid red" } : {}
            }
            className={styles.basicInput}
            placeholder="Enter Rate"
            value={newItem.rate}
          />
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
        <div className={styles.colSpan2}>
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
        <button
            onClick={handleAddMaterial}
            className={styles2.button50}
            aria-label="Add"
            style={{ width: '60px' }}
          >
            <span className={styles2.button50__Content}>
              <span className={styles2.button50__Text}>{isEditing ? "Edit" : "Add"}</span>
            </span>
          </button>
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className={styles2.button50}
              aria-label="Cancel"
              style={{ width: '200px' }}
            >
              <span className={styles2.button50__Content}>
                <span className={styles2.button50__Text}>Cancel</span>
              </span>
            </button>
          )}
      </div>

      <div>
        <CustomAgGrid
                rowData={itemGridData}
                setIsEditing={setIsEditing}
                setRowData={setItemGridData}
                columnDefs={columnDefs}
                setFormData={setNewItem}
                gridHeight="220px"
                cellClicked={true}
                editEnabled={true}
                deleteEnabled={true}
                pagination={false}
              />
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
