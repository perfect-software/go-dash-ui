import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/itemDirectory.module.css";
import { getApiService, postApiService } from "../service/apiService";
import ItemHeadPopup from "../popups/ItemHeadPopup";

import Downshift from "downshift";
const ItemDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const [itemSubGroupNumber, setItemSubGroupNumber] = useState("");
  const [itemsGrpData, setItemsGrpData] = useState([]);
  const [isItemHeadPopup, setIsItemHeadPopup] = useState(false);
  const [colors, setColors] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState({
    animalList: [],
    seasonList: [],
    substanceList: [],
    textureList: [],
    characteristicsList: [],
    tanneryList: [],
    originList: [],
    tanningList: [],
    skintypeList: [],
    itemGrpList: [],
    itemSubGrpList: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    animal: false,
    season: false,
    itemgrp: false,
    itemsubgrp: false,
    substance: false,
    texture: false,
    characteristics: false,
    tannery: false,
    origin: false,
    tanning: false,
    color: false,
    skintype: false,
  });

  const [itemForm, setItemForm] = useState(() => {
    const savedForm = localStorage.getItem('itemForm');
    return savedForm ? JSON.parse(savedForm) : {
      animal: "",
      itemgrp: "",
      itemsubgrp: "",
      season: "",
      characteristics: "",
      texture: "",
      substance: "",
      tanning: "",
      origin: "",
      tannery: "",
      color: "",
      uniquecode: "",
      skintype: "",
      size: "",
    };
  });

  
  useEffect(() => {
    localStorage.setItem('itemForm', JSON.stringify(itemForm));
  }, [itemForm]);

  const resetItem = () => {
    setItemForm({
      animal: "",
      season: "",
      characteristics: "",
      texture: "",
      substance: "",
      tanning: "",
      itemgrp: "",
      itemsubgrp: "",
      origin: "",
      tannery: "",
      color: "",
      uniquecode: "",
      skintype: "",
      size: "",
    });
  };

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  useEffect(() => {
    if (itemsData.length === 0) {
      getItems();
    }
    if (itemsGrpData.length === 0) {
      getGrpItems();
    }
  }, []);

  const getGrpItems = async () => {
    const BASE_URL = "item/getItemGrpAndSubGrp";
    try {
      const response = await getApiService(BASE_URL);
      setItemsGrpData(response);
    } catch (error) {
      console.error("Failed to fetch Group Items:", error);
    }
  };

  const getItems = async () => {
    const BASE_URL = "item/getItemHead";
    try {
      const response = await getApiService(BASE_URL);
      setItemsData(response);
    } catch (error) {
      console.error("Failed to fetch Items:", error);
    }
  };

  const handleItemMultipleChange = (e) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });
    const lastEnteredValue = value
      .split(",")
      .map((item) => item.trim())
      .pop();
    if (lastEnteredValue !== "") {
      const concatenatedString = `${name}List`;
      const filtered = itemsData
        .filter(
          (item) =>
            item.head.toLowerCase() === name.toLowerCase() &&
            item.value.toLowerCase().includes(lastEnteredValue.toLowerCase())
        )
        .map((item) => ({
          name: item.value,
        }));
      const updatedFilteredList = {
        ...filteredList,
        [concatenatedString]: filtered,
      };

      setFilteredList(updatedFilteredList);
    }
    if (value.length > 0) {
      toggleSuggestVisibility(`${name}`, true);
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
  };
  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });
    if (value.length >= 2) {
      const BASE_URL = `sample/color/{input}?input=${encodeURIComponent(
        value
      )}`;

      try {
        const fetchedColors = await getApiService(BASE_URL);
        setColors(fetchedColors);

        toggleSuggestVisibility(`${name}`, true);
      } catch (error) {
        console.error("Failed to fetch Colors:", error);
      }
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
  };
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });

    const concatenatedString = `${name}List`;

    const filtered = itemsData
      .filter(
        (item) =>
          item.head.toLowerCase() === name.toLowerCase() &&
          item.value.toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => ({
        name: item.value,
      }));

    const updatedFilteredList = {
      ...filteredList,
      [concatenatedString]: filtered,
    };

    setFilteredList(updatedFilteredList);
    if (value.length > 0) {
      toggleSuggestVisibility(`${name}`, true);
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
  };

  const handleGrpItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });

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

  const handleButtonClick = (name) => {
    const concatenatedString = `${name}List`;

    const filtered = itemsData
      .filter((item) => item.head.toLowerCase() === name.toLowerCase())
      .map((item) => ({
        name: item.value,
      }));

    const updatedFilteredList = {
      ...filteredList,
      [concatenatedString]: filtered,
    };
    setFilteredList(updatedFilteredList);

    toggleSuggestVisibility(name, !showSuggestions[name]);
  };

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

  const handleSuggestionClick = (selectedValue, fieldName) => {
    let valuesArray = itemForm[fieldName]
      ? itemForm[fieldName].split(",").map((val) => val.trim())
      : [];
    if (valuesArray.length > 0) {
      valuesArray[valuesArray.length - 1] = selectedValue;
    } else {
      valuesArray.push(selectedValue);
    }

    valuesArray = [...new Set(valuesArray)];
    const updatedValue = valuesArray.join(", ");
    setItemForm({ ...itemForm, [fieldName]: updatedValue });
    setShowSuggestions({ ...showSuggestions, [fieldName]: false });
  };
  const animalInputRef = useRef(null);
  const downshiftAnimal = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            animal: selectedItem.name,
          });
          toggleSuggestVisibility("animal", false);
        }
      }}
      selectedItem={itemForm.animal}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "animal",
            })}
            type="text"
            ref={animalInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.animal}
          />

          <button
            onClick={() => {
              handleButtonClick("animal");
              animalInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.animal && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.animalList.map((item, index) => (
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

  const seasonInputRef = useRef(null);
  const downshiftSeason = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            season: selectedItem.name,
          });
          toggleSuggestVisibility("season", false);
        }
      }}
      selectedItem={itemForm.season}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "season",
            })}
            type="text"
            ref={seasonInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.season}
          />

          <button
            onClick={() => {
              handleButtonClick("season");
              seasonInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.season && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.seasonList.map((item, index) => (
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

  const substanceInputRef = useRef(null);
  const downshiftSubstance = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            substance: selectedItem.name,
          });
          toggleSuggestVisibility("substance", false);
        }
      }}
      selectedItem={itemForm.substance}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "substance",
            })}
            type="text"
            ref={substanceInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.substance}
          />

          <button
            onClick={() => {
              handleButtonClick("substance");
              substanceInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.substance && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.substanceList.map((item, index) => (
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

  const textureInputRef = useRef(null);
  const downshiftTexture = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            texture: selectedItem.name,
          });
          toggleSuggestVisibility("texture", false);
        }
      }}
      selectedItem={itemForm.texture}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "texture",
            })}
            type="text"
            ref={textureInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.texture}
          />

          <button
            onClick={() => {
              handleButtonClick("texture");
              textureInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.texture && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.textureList.map((item, index) => (
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

  const characteristicsInputRef = useRef(null);
  const downshiftCharacteristics = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          handleSuggestionClick(selectedItem.name, "characteristics");
        }
      }}
      selectedItem={itemForm.characteristics}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemMultipleChange,
              name: "characteristics",
            })}
            type="text"
            ref={characteristicsInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.characteristics}
          />

          <button
            onClick={() => {
              handleButtonClick("characteristics");
              characteristicsInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.characteristics && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.characteristicsList.map((item, index) => (
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

  const tanningInputRef = useRef(null);
  const downshiftTanning = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            tanning: selectedItem.name,
          });
          toggleSuggestVisibility("tanning", false);
        }
      }}
      selectedItem={itemForm.tanning}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "tanning",
            })}
            type="text"
            ref={tanningInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.tanning}
          />

          <button
            onClick={() => {
              handleButtonClick("tanning");
              tanningInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.tanning && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.tanningList.map((item, index) => (
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

  const originInputRef = useRef(null);
  const downshiftOrigin = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            origin: selectedItem.name,
          });
          toggleSuggestVisibility("origin", false);
        }
      }}
      selectedItem={itemForm.origin}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "origin",
            })}
            type="text"
            ref={originInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.origin}
          />

          <button
            onClick={() => {
              handleButtonClick("origin");
              originInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.origin && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.originList.map((item, index) => (
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

  const tanneryInputRef = useRef(null);
  const downshiftTannery = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            tannery: selectedItem.name,
          });
          toggleSuggestVisibility("tannery", false);
        }
      }}
      selectedItem={itemForm.tannery}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "tannery",
            })}
            type="text"
            ref={tanneryInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.tannery}
          />

          <button
            onClick={() => {
              handleButtonClick("tannery");
              tanneryInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.tannery && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.tanneryList.map((item, index) => (
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

  const downshiftColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            color: selectedItem,
          });
          toggleSuggestVisibility("color", false);
        }
      }}
      selectedItem={itemForm.color}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "color",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={itemForm.color}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.color &&
              colors.map((color, index) => (
                <div
                  {...getItemProps({ key: index, index, item: color })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {color}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const skintypeInputRef = useRef(null);
  const downshiftSkinType = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            skintype: selectedItem.name,
          });
          toggleSuggestVisibility("skintype", false);
        }
      }}
      selectedItem={itemForm.skintype}
      itemToString={(item) => (item ? item.name : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleItemChange,
              name: "skintype",
            })}
            type="text"
            ref={skintypeInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={itemForm.skintype}
          />

          <button
            onClick={() => {
              handleButtonClick("skintype");
              skintypeInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.skintype && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.skintypeList.map((item, index) => (
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

  const itemGrpRef = useRef(null);
  const downshiftItemGrp = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setItemForm({
            ...itemForm,
            itemgrp: selectedItem.name,
          });
          setItemGroupNumber(selectedItem.number);
          toggleSuggestVisibility("itemgrp", false);
        }
      }}
      selectedItem={itemForm.itemgrp}
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
            value={itemForm.itemgrp}
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
          setItemForm({
            ...itemForm,
            itemsubgrp: selectedItem.name,
          });
          setItemSubGroupNumber(selectedItem.number);
          toggleSuggestVisibility("itemsubgrp", false);
        }
      }}
      selectedItem={itemForm.itemsubgrp}
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
            value={itemForm.itemsubgrp}
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

  const handleSubmitItemClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (itemForm.characteristics) {
      itemForm.characteristics = itemForm.characteristics.replace(/,\s*/g, " ");
    }
    setItemForm(prevItem => ({
      ...prevItem,
      itemgrp: itemGroupNumber,
      itemsubgrp:itemSubGroupNumber
    }));
    const formData = Object.entries(itemForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});

   console.log(formData);

    const BASE_URL = "item/create";
    try {
      const responseData = await postApiService(formData, BASE_URL);
      togglePopup(responseData.message);
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
      setLoading(false);
    }
  };
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };
  return (
    <div className={styles.itemPageContainer}>
      <div className={styles.itemDirectoryContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>Item Directory</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <div className={styles.subHeadContainerThree}>
              <h2>Create Item</h2>
              <button
                className={styles.headButton}
                onClick={() => setIsItemHeadPopup(true)}
              >
                Insert New Value
              </button>
            </div>
            <div className={styles.headBorder}></div>
          </div>
        </div>

        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="skinSize">
              Item Group
            </label>

            {downshiftItemGrp}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="skinSize">
              Item <br /> Sub Group
            </label>
            {downshiftItemSubGrp}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="season">
              Animal
            </label>
            {downshiftAnimal}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="season">
              Season
            </label>
            {downshiftSeason}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="substance">
              Substance
            </label>
            {downshiftSubstance}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="substance">
              Texture
            </label>
            {downshiftTexture}
          </div>

          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="characteristics">
              Character -<br />
              istics
            </label>
            {downshiftCharacteristics}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tanning">
              Tanning
            </label>
            {downshiftTanning}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="origin">
              Origin
            </label>
            {downshiftOrigin}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tannery">
              Tannery
            </label>
            {downshiftTannery}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="color">
              Color
            </label>
            {downshiftColor}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="uniqueCode">
              Unique Code
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              value={itemForm.uniquecode}
              name="uniquecode"
              onChange={(e) =>
                setItemForm({ ...itemForm, uniquecode: e.target.value })
              }
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="skinType">
              Skin Type
            </label>
            {downshiftSkinType}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="skinSize">
              Skin Size
            </label>

            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              value={itemForm.size}
              name="size"
              onChange={(e) =>
                setItemForm({ ...itemForm, size: e.target.value })
              }
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="itemName">
              Item Name (Own)
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              name="itemname"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="supplierItemName">
              Supplier <br /> Item Name
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
            />
          </div>
        </div>
      </div>
      <div className={styles.parentButtonContainer}>
        {loading ? (
          <div className={styles.buttonContainer}>
            <div className={styles.loader}></div>
          </div>
        ) : (
          <div className={styles.buttonContainer}>
            <button className={styles.resetButton} onClick={() => resetItem()}>
              Reset
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmitItemClick}
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
      {isItemHeadPopup && (
        <ItemHeadPopup
          onCancel={() => {
            setIsItemHeadPopup(false);
            getItems();
          }}
          itemForm={itemForm}
        />
      )}
    </div>
  );
};

export default ItemDirectory;
