import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/bom.module.css";
import Downshift from "downshift";
import { useSelector, useDispatch } from "react-redux";
import { fetchItemGroupsAndSubGroups } from "../reducer/grpSubgrpSlice";
import { useSidebar } from "../context/SidebarContext";
import { getApiService } from "../service/apiService";
const MaterialTable = ({ bomData, setBomData  }) => {
  const [itemNames, setItemNames] = useState([]);
  const { isCollapsed } = useSidebar();
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const initialValidationState = {};
  const [validation, setValidation] = useState(initialValidationState);
  const [filteredList, setFilteredList] = useState({
    itemGrpList: [],
    itemSubGrpList: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    itemId: false,
    itemgrp: false,
    itemsubgrp: false,
  });

  const [newItem, setNewItem] = useState({
    itemgrp: "",
    itemsubgrp: "",
    itemId: "",
    usedIn: "",
    pair: "",
    supplierId:"",
    stockConsumedQty:"",
    bomQty: "",
    unit:"",
    requiredQty: "",
    rate: "",
    cost: "",
  });
  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = [
    "itemgrp",
    "itemsubgrp",
    "itemId",
    "supplierId",
    "stockConsumedQty",
    "bomQty",
    "unit",
    "requiredQty",
    "rate"
    ];

    requiredFields.forEach((field) => {
      if (!newItem[field] || newItem[field].trim() === "") {
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

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchItemGroupsAndSubGroups());
    }
  }, [loaded, loading, dispatch]);

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
    setValidation(prev => ({ ...prev, [name]: 'valid' }));
  };

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const handleGrpItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  
    if (name === "itemgrp") {
      const filtered = Object.entries(itemGroups)
        .filter(([key, groupName]) => groupName.toLowerCase().includes(value.toLowerCase()))
        .reduce((acc, [key, groupName]) => {
          acc[key] = groupName;
          return acc;
        }, {});
  
      setFilteredList({ ...filteredList, itemGrpList: filtered });
      toggleSuggestVisibility(name, value.length > 0);
    }
    if (name === "itemsubgrp") {
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
    setValidation(prev => ({ ...prev, [name]: 'valid' }));
  };
  const handleItemNameChange = async (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, itemId: value }));
    toggleSuggestVisibility(name, value.length > 0);

    if (value.length >= 1) {
      const BASE_URL = `item/getItemName?input=${encodeURIComponent(value)}`;
      try {
        const fetchedItemName = await getApiService(BASE_URL);
        setItemNames(fetchedItemName);
      } catch (error) {
        console.error("Failed to fetch Item Names:", error);
      }
    } else {
      setItemNames([]);
    }
    setValidation(prev => ({ ...prev, [name]: 'valid' }));
  };

  const handleAddMaterial = () => {
    if (!validateForm()) {
      return; 
    }
    setBomData((prevData) => {
      let newData = JSON.parse(JSON.stringify(prevData));
      let group = newData.groups.find((g) => g.itemgrp === newItem.itemgrp);
      if (!group) {
        group = { itemgrp: newItem.itemgrp, subgroups: [] };
        newData.groups = [...newData.groups, group];
      }
      let subgroup = group.subgroups.find(
        (sg) => sg.itemsubgrp === newItem.itemsubgrp
      );
      if (!subgroup) {
        subgroup = { itemsubgrp: newItem.itemsubgrp, items: [] };
        group.subgroups = [...group.subgroups, subgroup];
      }
      const itemExists = subgroup.items.some(
        (i) => i.itemId === newItem.itemId
      );
      if (itemExists) {
        console.warn("Item already exists");
      } else {
        subgroup.items.push({
          itemId: newItem.itemId,
          usedIn: newItem.usedIn,
          pair: newItem.pair,
          bomQty: newItem.bomQty,
          supplierId:newItem.supplierId,
          stockConsumedQty:newItem.stockConsumedQty,
          unit:newItem.unit,
          requiredQty: newItem.requiredQty,
          cost: newItem.cost,
          rate: newItem.rate,
        });
      }
      setNewItem({
        itemgrp: "",
        itemsubgrp: "",
        itemId: "",
        usedIn: "",
        supplierId:"",
        unit:"",
        stockConsumedQty:"",
        pair: "",
        bomQty: "",
        requiredQty: "",
        rate: "",
        cost: "",
      });

      let totalCost = 0;
      newData.groups.forEach((group) =>
        group.subgroups.forEach((subgroup) =>
          subgroup.items.forEach(
            (item) => (totalCost += parseFloat(item.cost) || 0)
          )
        )
      );
      newData.totalCost = totalCost.toFixed(2);

      return newData;
    });
  };

  const handleRemoveItem = (itemgrp, itemsubgrp, itemId) => {
    setBomData((prevData) => {
      let groupFound = false;
      let subgroupFound = false;
      let removedItemCost = 0;

      const groups = prevData.groups
        .map((group) => {
          if (group.itemgrp === itemgrp) {
            groupFound = true;
            const subgroups = group.subgroups
              .map((subgroup) => {
                if (subgroup.itemsubgrp === itemsubgrp) {
                  subgroupFound = true;
                  const items = subgroup.items.filter((item) => {
                    if (item.itemId === itemId) {
                      removedItemCost = parseFloat(item.cost) || 0;
                      return false;
                    }
                    return true;
                  });
                  return { ...subgroup, items };
                }
                return subgroup;
              })
              .filter((subgroup) => subgroup.items.length > 0);
            return { ...group, subgroups };
          }
          return group;
        })
        .filter((group) => group.subgroups.length > 0);

      if (!groupFound || !subgroupFound) {
        return prevData;
      }

      const newTotalCost = prevData.totalCost - removedItemCost;

      return {
        ...prevData,
        groups,
        totalCost: newTotalCost.toFixed(2),
      };
    });
  };


  const handleGrpButtonClick = (name) => {
    if (name === "itemgrp") {
      setFilteredList({ ...filteredList, itemGrpList: itemGroups });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }

    if (name === "itemsubgrp") {
      const filtered = Object.entries(itemSubGroups)
        .filter(([key, subGroupDetails]) => 
          subGroupDetails.groupNumber.toLowerCase() === itemGroupNumber.toLowerCase()
        )
        .reduce((acc, [key, subGroupDetails]) => {
          acc[key] = subGroupDetails.name; 
          return acc;
        }, {});
    
      setFilteredList({ ...filteredList, itemSubGrpList: filtered });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }
    setValidation(prev => ({ ...prev, [name]: 'valid' }));
  };



  const renderTableBody = () => {
    let rows = [];

    bomData.groups.forEach((group) => {
      let totalItemsInGroup = group.subgroups.reduce(
        (sum, subgroup) => sum + subgroup.items.length,
        0
      );

      group.subgroups.forEach((subgroup, subgroupIndex) => {
        subgroup.items.forEach((item, itemIndex) => {
          rows.push(
            <tr
              key={`${group.itemgrp}-${subgroup.itemsubgrp}-${item.itemId}`}
            >
              {subgroupIndex === 0 && itemIndex === 0 && (
                <td rowSpan={totalItemsInGroup}>{group.itemgrp}</td>
              )}
              {itemIndex === 0 && (
                <td rowSpan={subgroup.items.length}>{subgroup.itemsubgrp}</td>
              )}
              <td>{item.itemId}</td>

              <td>{item.usedIn}</td>

              <td>{item.pair}</td>

              <td>{item.bomQty}</td>
             <td>{item.stockConsumedQty}</td>

              <td>{item.requiredQty}</td>
              <td>{item.rate}</td>
              <td>{item.unit}</td>
              <td>{item.supplierId}</td>
              <td>{item.cost}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() =>
                    handleRemoveItem(
                      group.itemgrp,
                      subgroup.itemsubgrp,
                      item.itemId
                    )
                  }
                  className={styles.minus}
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
          setNewItem((prevNewItem) => ({
            ...prevNewItem,
            itemId: selectedItem,
          }));
          toggleSuggestVisibility("itemId", false);
          setItemNames([]);
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
            style={validation.itemId === 'invalid' ? { border: "2px solid red" } : {}}
            placeholder="Type a word"
            value={newItem.itemId}
          />

          <div {...getMenuProps()} className={styles.suggestions}>
            {isOpen &&
              itemNames.map((name, idx) => (
                <div
                  {...getItemProps({ key: idx, index: idx, item: name })}
                  className={
                    highlightedIndex === idx
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {name}
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
            itemgrp: selectedItem.name,
          }));
          setItemGroupNumber(selectedItem.id);
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
            style={validation.itemgrp === 'invalid' ? { border: "2px solid red" } : {}}
            placeholder="Insert First Letter"
            value={newItem.itemgrp}
          />

          <button
            onClick={() => {
              handleGrpButtonClick("itemgrp");
              itemGrpRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

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
            itemsubgrp: selectedItem.name,
          }));
          toggleSuggestVisibility("itemsubgrp", false);
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
            style={validation.itemsubgrp === 'invalid' ? { border: "2px solid red" } : {}}
            disabled={!newItem.itemgrp}
            value={newItem.itemsubgrp}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddMaterial();
              }
            }}
          />

          <button
            onClick={() => {
              handleGrpButtonClick("itemsubgrp");
              itemSubGrpRef.current?.focus();
            }}
            className={styles.searchBtn}
            disabled={!newItem.itemgrp}
            aria-label="dropDorn"
          ></button>

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
          <label className={styles.sampleLabel} htmlFor="bomQty">
            BOM Qty
          </label>
          <input
            type="number"
            name="bomQty"
            value={newItem.bomQty}
            onChange={handleInputChange}
            style={validation.bomQty === 'invalid' ? { border: "2px solid red" } : {}}
            placeholder="BOM Qty"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="stockConsumedQty">
            Stock C.Qty
          </label>
          <input
            type="text"
            name="stockConsumedQty"
            value={newItem.stockConsumedQty}
            style={validation.stockConsumedQty === 'invalid' ? { border: "2px solid red" } : {}}
            onChange={handleInputChange}
            placeholder="Stock Consumed Qty"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="requiredQty">
            Extra
          </label>
          <input
            type="text"
            name="requiredQty"
            value={newItem.requiredQty}
            style={validation.requiredQty === 'invalid' ? { border: "2px solid red" } : {}}
            onChange={handleInputChange}
            placeholder="Required Qty"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="rate">
            Rate
          </label>
          <input
            name="rate"
            type="number"
            onChange={handleInputChange}
            style={validation.rate === 'invalid' ? { border: "2px solid red" } : {}}
            className={styles.basicInput}
            placeholder="Enter Rate"
            value={newItem.rate}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="unit">
            Unit
          </label>
          <input
            name="unit"
            type="text"
            onChange={handleInputChange}
            style={validation.unit === 'invalid' ? { border: "2px solid red" } : {}}
            className={styles.basicInput}
            placeholder="Enter unit"
            value={newItem.unit}
          />
        </div>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="supplierId">
            Supplier
          </label>
          <input
            name="supplierId"
            type="text"
            onChange={handleInputChange}
            style={validation.supplierId === 'invalid' ? { border: "2px solid red" } : {}}
            className={styles.basicInput}
            placeholder="Enter supplier"
            value={newItem.supplierId}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="cost">
            Cost
          </label>
          <input
            name="cost"
            type="number"
            value={newItem.cost}
            readOnly
            onChange={handleInputChange}
            className={styles.basicInput}
            placeholder="Add Cost"
          />
        </div>
        <div className={styles.colSpan2}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Group
          </label>
          <input
            name="itemgrp"
            type="text"
            value={newItem.itemgrp}
          
            onChange={handleInputChange}
            className={styles.basicInput}
           
          />
          {/* {downshiftItemGrp} */}
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemsubgrp">
            Sub Group
          </label>
          <input
            name="itemsubgrp"
            type="text"
            value={newItem.itemsubgrp}
      
            onChange={handleInputChange}
            className={styles.basicInput}
          
          />
          {/* {downshiftItemSubGrp} */}
        </div>
        <div className={styles.colSpan}>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddMaterial();
            }}
            className={styles.addBtn}
            aria-label="Search"
          >
            {" "}
            ADD{" "}
          </button>
        </div>
      </div>

      <div
        className={isCollapsed ? styles.topContainer : styles.topContainerOpen}
      >
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Group</th>
              <th>Subgroup</th>
              <th>Item Name</th>
              <th>Used In</th>
              <th>Pair</th>
              <th>BOM Qty</th>
              <th>Stock Consumed Qty</th>
              <th>Extra</th>
              <th>Rate</th>
              <th>Unit</th>
              <th>Supplier</th>
              <th>Cost</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
          {bomData.groups.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="11"></td>
                <td>
                  <strong>Total: {bomData.totalCost}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
};

export default MaterialTable;
