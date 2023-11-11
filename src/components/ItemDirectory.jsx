import React, { useEffect, useState } from "react";
import styles from "../styles/itemDirectory.module.css";
import { getCurrentYearLastTwoDigits } from "../features/convertDate";
import { getApiService, postApiService } from "../service/apiService";

const ItemDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredList, setFilteredList] = useState({
    animalList: [],
    seasonList: [],
    substanceList: [],
    textureList: [],
    characteristicsList: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    animal: false,
    season: false,
    substance: false,
    texture: false,
    characteristics: false,
  });
  const [itemForm, setItemForm] = useState({
    animal: "",
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
    itemname: "",
  });

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
      console.log(itemsData);
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
            item.head === name &&
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

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm({ ...itemForm, [name]: value });

    const concatenatedString = `${name}List`;

    const filtered = itemsData
      .filter(
        (item) =>
          item.head === `${name}` &&
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
  const handleButtonClick = (name) => {
    const concatenatedString = `${name}List`;

    const filtered = itemsData
      .filter((item) => item.head === name)
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

  const handleSubmitItemClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = Object.entries(itemForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});
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
            <h2>Create Item</h2>
            <div className={styles.headBorder}></div>
          </div>
        </div>

        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="animal">
              Animal
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={itemForm.animal}
                name="animal"
                onChange={handleItemChange}
              />
              <button
                onClick={() => handleButtonClick("animal")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.animal && (
                <div className={styles.suggestions}>
                  {filteredList.animalList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setItemForm({
                          ...itemForm,
                          animal: item.name,
                        });
                        toggleSuggestVisibility("animal", false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="season">
              Season
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={itemForm.season}
                name="season"
                onChange={handleItemChange}
              />
              <button
                onClick={() => handleButtonClick("season")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.season && (
                <div className={styles.suggestions}>
                  {filteredList.seasonList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setItemForm({
                          ...itemForm,
                          season: item.name,
                        });
                        toggleSuggestVisibility("season", false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="substance">
              Substance
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={itemForm.substance}
                name="substance"
                onChange={handleItemChange}
              />
              <button
                onClick={() => handleButtonClick("substance")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.substance && (
                <div className={styles.suggestions}>
                  {filteredList.substanceList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setItemForm({
                          ...itemForm,
                          substance: item.name,
                        });
                        toggleSuggestVisibility("substance", false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="characteristics">
              Character -<br />
              istics
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Multiple Entry Using Comma"
                value={itemForm.characteristics}
                name="characteristics"
                onChange={handleItemMultipleChange}
              />
              <button
                onClick={() => handleButtonClick("characteristics")}
                className={styles.searchBtn}
                aria-label="dropDown"
              ></button>
              {showSuggestions.characteristics && (
                <div className={styles.suggestions}>
                  {filteredList.characteristicsList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() =>
                        handleSuggestionClick(item.name, "characteristics")
                      }
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="substance">
              Texture
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={itemForm.texture}
                name="texture"
                onChange={handleItemChange}
              />
              <button
                onClick={() => handleButtonClick("texture")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.texture && (
                <div className={styles.suggestions}>
                  {filteredList.textureList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setItemForm({
                          ...itemForm,
                          texture: item.name,
                        });
                        toggleSuggestVisibility("texture", false);
                      }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tanning">
              Tanning
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              value={itemForm.tanning}
              name="tanning"
              onChange={(e) =>
                setItemForm({ ...itemForm, tanning: e.target.value })
              }
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="origin">
              Origin
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              value={itemForm.origin}
              name="origin"
              onChange={(e) =>
                setItemForm({ ...itemForm, origin: e.target.value })
              }
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="tannery">
              Tannery
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              value={itemForm.tannery}
              name="tannery"
              onChange={(e) =>
                setItemForm({ ...itemForm, tannery: e.target.value })
              }
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="color">
              Color
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Write here"
              value={itemForm.color}
              name="color"
              onChange={(e) =>
                setItemForm({ ...itemForm, color: e.target.value })
              }
            />
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
            <div className={styles.selectWrapper}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Write here"
                value={itemForm.skintype}
                name="skintype"
                onChange={(e) =>
                  setItemForm({ ...itemForm, skintype: e.target.value })
                }
              />
            </div>
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
              value={itemForm.itemname}
              name="itemname"
              onChange={(e) =>
                setItemForm({ ...itemForm, itemname: e.target.value })
              }
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
            <button className={styles.resetButton}>Reset</button>
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
    </div>
  );
};

export default ItemDirectory;
