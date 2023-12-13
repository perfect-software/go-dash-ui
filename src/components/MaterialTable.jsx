import React, { useState } from "react";
import styles from "../styles/bom.module.css";
import Downshift from "downshift";
import { getApiService } from "../service/apiService";
const MaterialTable = () => {
  const [materialData, setMaterialData] = useState([]);
  const [groupInput, setGroupInput] = useState("");
  const [subgroupInput, setSubgroupInput] = useState("");
  const [itemNameInput, setItemNameInput] = useState("");
  const [itemNames, setItemNames] = useState([]);

  const [materialForm, setMaterialForm] = useState({
    itemName: "",
  });

  const [showSuggestions, setShowSuggestions] = useState({
    itemName: false,
  });
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };
  const handleItemNameChange = async (e) => {
    const { value } = e.target;
    setItemNameInput(value);

    if (value.length >= 1) {
      const BASE_URL = `item/getItemName?input=${encodeURIComponent(value)}`;
      try {
        const fetchedItemName = await getApiService(BASE_URL);
        setItemNames(fetchedItemName);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch Item Names:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };
  const handleAddMaterial = () => {
    if (!groupInput.trim() || !subgroupInput.trim() || !itemNameInput.trim()) {
      alert("All fields are required.");
      return;
    }

    setMaterialData((prevData) => {
      let group = prevData.find((g) => g.name === groupInput.trim());
      if (!group) {
        group = { name: groupInput.trim(), subgroups: [] };
        prevData = [...prevData, group];
      }
      let subgroup = group.subgroups.find(
        (sg) => sg.name === subgroupInput.trim()
      );
      if (!subgroup) {
        subgroup = { name: subgroupInput.trim(), items: [] };
        group.subgroups = [...group.subgroups, subgroup];
      }
      const itemExists = subgroup.items.some(
        (item) => item.name === itemNameInput.trim()
      );
      if (!itemExists) {
        subgroup.items = [
          ...subgroup.items,
          { name: itemNameInput.trim(), columns: new Array(4).fill("") },
        ];
      }
     
      setItemNameInput("");
      return prevData;
    });
  };

  const handleRemoveItem = (groupName, subgroupName, itemName) => {
    setMaterialData((prevData) => {
      const newData = prevData
        .map((group) => {
          if (group.name === groupName) {
            const newSubgroups = group.subgroups
              .map((subgroup) => {
                if (subgroup.name === subgroupName) {
                  const newItems = subgroup.items.filter(
                    (item) => item.name !== itemName
                  );
                  return { ...subgroup, items: newItems };
                }
                return subgroup;
              })
              .filter((subgroup) => subgroup.items.length > 0); 
            return { ...group, subgroups: newSubgroups };
          }
          return group;
        })
        .filter((group) => group.subgroups.length > 0);

      return newData;
    });
  };

  const renderTableBody = () => {
    return materialData.map((group, groupIndex) =>
      group.subgroups.map((subgroup, subgroupIndex) =>
        subgroup.items.map((item, itemIndex) => (
          <tr key={`${group.name}-${subgroup.name}-${item.name}-${itemIndex}`}>
            {subgroupIndex === 0 && itemIndex === 0 && (
              <td rowSpan={group.subgroups.flatMap((sg) => sg.items).length}>
                {group.name}
              </td>
            )}
            {itemIndex === 0 && (
              <td rowSpan={subgroup.items.length}>{subgroup.name}</td>
            )}
            <td>{item.name}</td>
            {item.columns.map((col, colIndex) => (
              <td key={colIndex}>{col}</td>
            ))}
            <td>
              <button
                onClick={() =>
                  handleRemoveItem(group.name, subgroup.name, item.name)
                }
              >
                Remove
              </button>
            </td>
          </tr>
        ))
      )
    );
  };

  const downshiftItemName = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemNameInput(selectedItem);
          setShowSuggestions(false);
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={itemNameInput}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemNameChange,
              name: "itemName",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Type a word"
            value={itemNameInput}
          />

          <button
            onClick={handleAddMaterial}
            className={styles.addBtn}
            aria-label="Search"
          ></button>

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions &&
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

  return (
    <>
      <div className={styles.middleGrid}>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="articleNo">
            Item Group
          </label>
          <input
            type="text"
            name="buyerName"
            className={styles.basicInput}
            value={groupInput}
            onChange={handleInputChange(setGroupInput)}
            placeholder="Item Group"
          />
        </div>
        <div className={styles.colSpan}>
          <label className={styles.sampleLabel} htmlFor="articleNo">
            Item Subgroup
          </label>
          <input
            type="text"
            name="buyerName"
            className={styles.basicInput}
            placeholder="Buyer Name"
            value={subgroupInput}
            onChange={handleInputChange(setSubgroupInput)}
          />
        </div>
        <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="itemName">
             Item Name
            </label>
            {downshiftItemName}
          </div>
      </div>

      <div className={styles.itemHeadContainer}>
        <table className={styles.customTable}>
          <thead>
            <tr>
              <th>Group</th>
              <th>Subgroup</th>
              <th>Item Name</th>
              <th>Used In</th>
              <th>Pair</th>
              <th>Bom Qty</th>
              <th>Required Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </>
  );
};

export default MaterialTable;
