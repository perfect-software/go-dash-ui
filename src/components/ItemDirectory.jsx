import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import { getApiService, postApiService } from "../service/apiService";
import ItemHeadPopup from "../popups/ItemHeadPopup";
import { useSelector, useDispatch } from "react-redux";
import { fetchItemGroupsAndSubGroups } from "../reducer/grpSubgrpSlice";
import Downshift from "downshift";
const ItemDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [itemGroupNumber, setItemGroupNumber] = useState("");
  const [itemSubGroupNumber, setItemSubGroupNumber] = useState("");
  const [isItemHeadPopup, setIsItemHeadPopup] = useState(false);
  const [itemListForm,setItemListForm] = useState({
    animal: "",
    leather:"",
    insole:"",
    sole:"",
    subCategory:"",
    soleType: "",
    lastType:"",
    toeShape: "",
    category: "",
    platformType: "",
    heelType: "",
    heelHeight: "",
    liningMaterial: "",
    socksMaterial: "",
  })
  const [colors, setColors] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showInputLoading, setShowInputLoading] = useState({
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
    const savedForm = localStorage.getItem("itemForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
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
    localStorage.setItem("itemForm", JSON.stringify(itemForm));
  }, [itemForm]);

  const dispatch = useDispatch();
  const { itemGroups, itemSubGroups, loaded, loading, error } = useSelector(
    (state) => state.data
  );
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
    
  };
  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchItemGroupsAndSubGroups());
    }
  }, [loaded, loading, dispatch]);

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

   
  }, []);

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
    toggleInputLoaderVisibility(`${name}`, true);
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
      toggleInputLoaderVisibility(`${name}`, false);
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
      toggleInputLoaderVisibility(`${name}`, true);
      const BASE_URL = `sample/color/{input}?input=${encodeURIComponent(
        value
      )}`;

      try {
        const fetchedColors = await getApiService(BASE_URL);
        setColors(fetchedColors);
        toggleInputLoaderVisibility(`${name}`, false);
        toggleSuggestVisibility(`${name}`, true);
      } catch (error) {
        console.error("Failed to fetch Colors:", error);
      }finally{
        toggleInputLoaderVisibility(`${name}`, false);
      }
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
  };
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
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
    toggleInputLoaderVisibility(`${name}`, false);
    if (value.length > 0) {
      toggleSuggestVisibility(`${name}`, true);
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
  };
  const handleGrpItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });
    toggleInputLoaderVisibility(`${name}`, true);
    if (name === "itemgrp") {
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
  };

  const handleButtonClick = (name) => {
    const concatenatedString = `${name}List`;
    toggleInputLoaderVisibility(`${name}`, true);
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
    toggleInputLoaderVisibility(`${name}`, false);
    toggleSuggestVisibility(name, !showSuggestions[name]);
  };

  const handleGrpButtonClick = (name) => {
    toggleInputLoaderVisibility(`${name}`, true);
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
    toggleInputLoaderVisibility(`${name}`, false);
  };

  const handleSuggestionClick = (selectedValue, fieldName) => {
    toggleInputLoaderVisibility(`${fieldName}`, true);
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
    toggleInputLoaderVisibility(`${fieldName}`, true);
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
{showInputLoading.animal ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("animal");
              animalInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     
         

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
{showInputLoading.season ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("season");
              seasonInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     

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
{showInputLoading.substance ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("substance");
              substanceInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     
       

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
{showInputLoading.texture ? (
            <div className={styles.dropLoader}></div>
          ) : (
          
            <button
            onClick={() => {
              handleButtonClick("texture");
              textureInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     

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
{showInputLoading.characteristics ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("characteristics");
              characteristicsInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     
        

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
{showInputLoading.tanning ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("tanning");
              tanningInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     
   

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
{showInputLoading.origin ? (
            <div className={styles.dropLoader}></div>
          ) : (
          
            <button
            onClick={() => {
              handleButtonClick("origin");
              originInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     

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
{showInputLoading.tannery ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("tannery");
              tanneryInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>
          )}
     
       

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
           {showInputLoading.color && (
            <div className={styles.dropLoader}></div>
          )}
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
{showInputLoading.skintype ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleButtonClick("skintype");
              skintypeInputRef.current?.focus();
            }}
            className={styles.dropBtn}
            aria-label="dropDorn"
          ></button>

          )}
     
  
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
          setItemGroupNumber(selectedItem.id);
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
{showInputLoading.itemgrp ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleGrpButtonClick("itemgrp");
              itemGrpRef.current?.focus();
            }}
            className={styles.dropBtn}
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
          setItemForm({
            ...itemForm,
            itemsubgrp: selectedItem.name,
          });
          setItemSubGroupNumber(selectedItem.id);
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
            disabled={!itemForm.itemgrp}
            value={itemForm.itemsubgrp}
          />
{showInputLoading.itemsubgrp ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
            onClick={() => {
              handleGrpButtonClick("itemsubgrp");
              itemSubGrpRef.current?.focus();
            }}
            className={styles.dropBtn}
            disabled={!itemForm.itemgrp}
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

  const handleSubmitItemClick = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const updatedItemForm = {
      ...itemForm,
      itemgrp: itemGroupNumber,
      itemsubgrp: itemSubGroupNumber,
      characteristics: itemForm.characteristics
        ? itemForm.characteristics.replace(/,\s*/g, " ")
        : itemForm.characteristics,
    };
    setItemForm(updatedItemForm);
    const formData = Object.entries(updatedItemForm).reduce(
      (acc, [key, value]) => {
        acc[key] = value === "" ? null : value;
        return acc;
      },
      {}
    );
 
    const BASE_URL = "item/create";
    try {
      const responseData = await postApiService(formData, BASE_URL);
      if (responseData.responseStatus && responseData.responseStatus.description) {
        togglePopup(
          responseData.responseStatus.description);
      }
      resetItem();
    } catch (error) {
      let errorMessage;
      if (error.response && error.response.data.responseStatus) {
        errorMessage =
          error.response.data.responseStatus.description ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response received from the server.";
      }
      togglePopup(errorMessage);
    } finally {
      setSubmitLoading(false);
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
          <div className={styles.simpleSubHeadContainer}>
            <h1 className={styles.headText}>Item Directory</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <div className={styles.subHeadContainerThree}>
              <h2>Create Item</h2>
              <button
                className={styles.headInsertValueButton}
                onClick={() => setIsItemHeadPopup(true)}
              >
                Insert New Value
              </button>
            </div>
            <div className={styles.headBorder}></div>
          </div>
        </div>

        <div className={styles.itemTopGrid}>
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
        {submitLoading ? (
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
          itemForm={itemListForm}
        />
      )}
    </div>
  );
};

export default ItemDirectory;
