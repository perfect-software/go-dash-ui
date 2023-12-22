import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/bom.module.css";
import Downshift from "downshift";
import { useSidebar } from "../context/SidebarContext";
import { getApiService } from "../service/apiService";
const MaterialTable = ({ bomData, setBomData }) => {
  const [itemNames, setItemNames] = useState([]);
  const { isCollapsed } = useSidebar();
  const [filteredList, setFilteredList] = useState({
    itemGrpList: [],
    itemSubGrpList: [],
  });
  const [itemsGrpData, setItemsGrpData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    itemName: false,
    itemgrp: false,
    itemsubgrp: false,
  });

  const [newItem, setNewItem] = useState({
    itemgrp: "",
    itemsubgrp: "",
    itemName: "",
    usedIn: "",
    pair: "",
    bomQty: "",
    requiredQty: "",
    rate: "",
    cost: "",
  });

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
      const filtered = itemsGrpData
        .filter((item) =>
          item.itemGrpName.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => ({
          name: item.itemGrpName,
          number: item.itemGrp,
        }));
      setFilteredList({ ...filteredList, itemGrpList: filtered });
      toggleSuggestVisibility(name, !showSuggestions[name]);
      if (value.length > 0) {
        toggleSuggestVisibility(`${name}`, true);
      } else {
        toggleSuggestVisibility(`${name}`, false);
      }
    }
    if (name === "itemsubgrp") {
      const filtered = itemsGrpData
        .filter((item) =>
          item.itemSubGrpName.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) => ({
          name: item.itemSubGrpName,
          number: item.itemSubGrp,
        }));
      setFilteredList({ ...filteredList, itemSubGrpList: filtered });
      toggleSuggestVisibility(name, !showSuggestions[name]);
      if (value.length > 0) {
        toggleSuggestVisibility(`${name}`, true);
      } else {
        toggleSuggestVisibility(`${name}`, false);
      }
    }
  };
  const handleItemNameChange = async (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, itemName: value }));
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
  };

  const handleAddMaterial = () => {
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
        (i) => i.itemName === newItem.itemName
      );
      if (itemExists) {
        console.warn("Item already exists");
      } else {
        subgroup.items.push({
          itemName: newItem.itemName,
          usedIn: newItem.usedIn,
          pair: newItem.pair,
          bomQty: newItem.bomQty,
          requiredQty: newItem.requiredQty,
          cost: newItem.cost,
          rate: newItem.rate,
        });
      }
      setNewItem({
        itemgrp: "",
        itemsubgrp: "",
        itemName: "",
        usedIn: "",
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

  const handleRemoveItem = (itemgrp, itemsubgrp, itemName) => {
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
                    if (item.itemName === itemName) {
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

  useEffect(() => {
    if (itemsGrpData.length === 0) {
      getGrpItems();
    }
  }, []);

  const handleGrpButtonClick = (name) => {
    if (name === "itemgrp") {
      const filtered = itemsGrpData.map((item) => ({
        name: item.itemGrpName,
        number: item.itemGrp,
      }));
      setFilteredList({ ...filteredList, itemGrpList: filtered });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }

    if (name === "itemsubgrp") {
      const filtered = itemsGrpData.map((item) => ({
        name: item.itemSubGrpName,
        number: item.itemSubGrp,
      }));
      setFilteredList({ ...filteredList, itemSubGrpList: filtered });
      toggleSuggestVisibility(name, !showSuggestions[name]);
    }
  };

  const getGrpItems = async () => {
    const BASE_URL = "item/getItemGrpAndSubGrp";
    try {
      const response = await getApiService(BASE_URL);
      setItemsGrpData(response);
    } catch (error) {
      console.error("Failed to fetch Group Items:", error);
    }
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
              key={`${group.itemgrp}-${subgroup.itemsubgrp}-${item.itemName}`}
            >
              {subgroupIndex === 0 && itemIndex === 0 && (
                <td rowSpan={totalItemsInGroup}>{group.itemgrp}</td>
              )}
              {itemIndex === 0 && (
                <td rowSpan={subgroup.items.length}>{subgroup.itemsubgrp}</td>
              )}
              <td>{item.itemName}</td>

              <td>{item.usedIn}</td>

              <td>{item.pair}</td>

              <td>{item.bomQty}</td>

              <td>{item.requiredQty}</td>
              <td>{item.rate}</td>
              <td>{item.cost}</td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() =>
                    handleRemoveItem(
                      group.itemgrp,
                      subgroup.itemsubgrp,
                      item.itemName
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
            itemName: selectedItem,
          }));
          toggleSuggestVisibility("itemName", false);
          setItemNames([]);
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={newItem.itemName}
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
              name: "itemName",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Type a word"
            value={newItem.itemName}
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
              {filteredList.itemGrpList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.name}
                </div>
              ))}
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
            aria-label="dropDorn"
          ></button>

          {showSuggestions.itemsubgrp && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.itemSubGrpList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.name}
                </div>
              ))}
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
          <label className={styles.sampleLabel} htmlFor="itemName">
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
            type="text"
            name="bomQty"
            value={newItem.bomQty}
            onChange={handleInputChange}
            placeholder="BOM Qty"
            className={styles.basicInput}
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="requiredQty">
            Required Qty
          </label>
          <input
            type="text"
            name="requiredQty"
            value={newItem.requiredQty}
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
            className={styles.basicInput}
            placeholder="Enter Rate"
            value={newItem.rate}
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
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemgrp">
            Group
          </label>
          {downshiftItemGrp}
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="itemsubgrp">
            Sub Group
          </label>
          {downshiftItemSubGrp}
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
              <th>Required Qty</th>
              <th>Rate</th>
              <th>Cost</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
          {bomData.groups.length > 0 && (
            <tfoot>
              <tr>
                <td colspan="8"></td>
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
