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

const GraphAverage = ({ bomData, setBomData ,resetTrigger, onResetDone }) => {
  const [itemNames, setItemNames] = useState([]);
  const { isCollapsed } = useSidebar();
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const initialValidationState = {};
  const [isRatePopup, setIsRatePopup] = useState(false);
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

  useEffect(() => {
    if (resetTrigger) {
      setBomData({
        groups: []
    });
      onResetDone(); 
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

    setBomData((prevData) => {
      let newData = JSON.parse(JSON.stringify(prevData));
      let group = newData.groups.find((g) => g.id === newItem.itemgrp.id);
      if (!group) {
        group = {
          id: newItem.itemgrp.id,
          name: newItem.itemgrp.name,
          subgroups: [],
        };
        newData.groups.push(group);
      }
      let subgroup = group.subgroups.find(
        (sg) => sg.id === newItem.itemsubgrp.id
      );
      if (!subgroup) {
        subgroup = {
          id: newItem.itemsubgrp.id,
          name: newItem.itemsubgrp.name,
          items: [],
        };
        group.subgroups.push(subgroup);
      }
      const existingItem = subgroup.items.find(
        (i) => i.itemId.id === newItem.itemId.id
      );
      if (existingItem) {
        console.warn("Item already exists");
        return newData;
      }

      subgroup.items.push({
        itemId: newItem.itemId.id,
        itemName: newItem.itemId.name,
        usedIn: newItem.usedIn,
        pair: newItem.pair,
        bomQty: newItem.bomQty,
        supplierId: newItem.supplierId.id,
        supplierName: newItem.supplierId.name,
        unit: newItem.unit,
        requiredQty: newItem.requiredQty,
        rate: newItem.rate,
        cost: newItem.cost,
      });
      let totalCost = newData.groups.reduce(
        (total, group) =>
          total +
          group.subgroups.reduce(
            (subTotal, subgroup) =>
              subTotal +
              subgroup.items.reduce(
                (itemTotal, item) => itemTotal + parseFloat(item.cost) || 0,
                0
              ),
            0
          ),
        0
      );

      newData.totalCost = totalCost.toFixed(2);

      return newData;
    });

    resetNewItemState();
  };

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

  const handleRemoveItem = (groupId, subgroupId, itemId) => {
    setBomData((prevData) => {
      let newData = JSON.parse(JSON.stringify(prevData));
      newData.groups = newData.groups
        .map((group) => {
          if (group.id === groupId) {
            group.subgroups = group.subgroups
              .map((subgroup) => {
                if (subgroup.id === subgroupId) {
                  subgroup.items = subgroup.items.filter(
                    (item) => item.itemId !== itemId
                  );
                }
                return subgroup;
              })
              .filter((subgroup) => subgroup.items.length > 0);
          }
          return group;
        })
        .filter((group) => group.subgroups.length > 0);
      let totalCost = newData.groups.reduce(
        (total, group) =>
          total +
          group.subgroups.reduce(
            (subTotal, subgroup) =>
              subTotal +
              subgroup.items.reduce(
                (itemTotal, item) => itemTotal + parseFloat(item.cost) || 0,
                0
              ),
            0
          ),
        0
      );

      newData.totalCost = totalCost.toFixed(2);

      return newData;
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

  const renderTableBody = () => {
    let rows = [];
    if (!bomData || !Array.isArray(bomData.groups) || bomData.groups.length === 0) {
      return (
        <tr>
          <td colSpan="12" style={{ textAlign: "center" }}>No data available</td>
        </tr>
      );
    }
    bomData.groups.forEach((group) => {
      let totalItemsInGroup = group.subgroups.reduce(
        (sum, subgroup) => sum + subgroup.items.length,
        0
      );
      group.subgroups.forEach((subgroup, subgroupIndex) => {
        subgroup.items.forEach((item, itemIndex) => {
          rows.push(
            <tr key={`${group.id}-${subgroup.id}-${item.itemId}`}>
              {subgroupIndex === 0 && itemIndex === 0 && (
                <td rowSpan={totalItemsInGroup}>{group.name}</td>
              )}
              {itemIndex === 0 && (
                <td rowSpan={subgroup.items.length}>{subgroup.name}</td>
              )}
              <td style={{maxWidth:'200px'}}>{item.itemName}</td>

              <td>{item.usedIn}</td>

              <td>{item.pair}</td>

              <td>{item.bomQty}</td>
              <td>{item.requiredQty}</td>
              <td>{item.rate}</td>
              <td>{item.unit}</td>
              <td>{item.supplierName}</td>
              <td style={{maxWidth:'100px'}}>{item.cost}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() =>
                    handleRemoveItem(group.id, subgroup.id, item.itemId)
                  }
                  className={tableStyles.minus}
                ></button>
              </td>
            </tr>
          );
        });
      });
    });

    return rows;
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
      <div className={styles.topGrid}>
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

      <div className={isCollapsed ? tableStyles.tableBor : tableStyles.tableBorOpen}>
        <table className={tableStyles.customTable}>
          <thead>
            <tr>
              <th>Group</th>
              <th>Subgroup</th>
              <th style={{maxWidth:'200px'}}>Item Name</th>
              <th>Used In</th>
              <th>Pair</th>
              <th>BOM Qty</th>
              <th>Extra</th>
              <th>Rate</th>
              <th>Unit</th>
              <th>Supplier</th>
              <th style={{maxWidth:'100px'}}>Cost</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
          {!bomData || !Array.isArray(bomData.groups) || bomData.groups.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="10"></td>
                <td>
                  <strong>Total: {bomData.totalCost}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
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
