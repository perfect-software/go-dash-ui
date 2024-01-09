import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/articleDirectory.module.css";
import { getApiService, postApiService } from "../service/apiService";

import Downshift from "downshift";
import ItemHeadPopup from "../popups/ItemHeadPopup";
const ArticleDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [colors, setColors] = useState([]);
  const [isItemHeadPopup, setIsItemHeadPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [articleForm, setArticleForm] = useState(() => {
    const savedForm = localStorage.getItem("articleForm");
    return savedForm
      ? JSON.parse(savedForm)
      : {
          articleName: "",
          animal: "",
          color: "",
          gender: "",
          soleType: "",
          toeShape: "",
          category: "",
          platformType: "",
          platformNo: "",
          heelType: "",
          heelNo: "",
          heelHeight: "",
          lastNo: "",
          liningMaterial: "",
          socksMaterial: "",
          comment: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("articleForm", JSON.stringify(articleForm));
  }, [articleForm]);
  const [filteredList, setFilteredList] = useState({
    animalList: [],
    soleTypeList: [],
    toeShapeList: [],
    heelTypeList: [],
    categoryList:[],
    liningMaterialList: [],
    socksMaterialList: [],
  });
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };

  const handleNormalArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleForm({
      ...articleForm,
      [name]: value,
    });
  };
  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setArticleForm({ ...articleForm, [name]: value });
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

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleForm({ ...articleForm, [name]: value });

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

  const [showSuggestions, setShowSuggestions] = useState({
    animal: false,
    soleType: false,
    toeShape: false,
    category:false,
    heelType: false,
    color: false,
    liningMaterial: false,
    socksMaterial: false,
  });
  const resetArticle = () => {
    setArticleForm({
      articleName: "",
      animal: "",
      color: "",
      gender: "",
      soleType: "",
      toeShape: "",
      category: "",
      platformType: "",
      platformNo: "",
      heelType: "",
      heelNo: "",
      heelHeight: "",
      lastNo: "",
      liningMaterial: "",
      socksMaterial: "",
      comment: "",
    
    });
  };

  const handleSubmitArticleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = Object.entries(articleForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});
    const BASE_URL = "article/create";
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

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };

  const animalInputRef = useRef(null);
  const downshiftAnimal = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            animal: selectedItem.name,
          });
          toggleSuggestVisibility("animal", false);
        }
      }}
      selectedItem={articleForm.animal}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "animal",
            })}
            type="text"
            ref={animalInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.animal}
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

  const downshiftColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            color: selectedItem,
          });
          toggleSuggestVisibility("color", false);
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={articleForm.color}
     

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
            placeholder="Type "
            value={articleForm.color}
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

  const soleTypeInputRef = useRef(null);
  const downshiftSoleType = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            soleType: selectedItem.name,
          });
          toggleSuggestVisibility("soleType", false);
        }
      }}
      selectedItem={articleForm.soleType}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "soleType",
            })}
            type="text"
            ref={soleTypeInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.soleType}
          />

          <button
            onClick={() => {
              handleButtonClick("soleType");
              soleTypeInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.soleType && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.soleTypeList.map((item, index) => (
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

  const toeShapeInputRef = useRef(null);
  const downshiftToeShape = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            toeShape: selectedItem.name,
          });
          toggleSuggestVisibility("toeShape", false);
        }
      }}
      selectedItem={articleForm.toeShape}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "toeShape",
            })}
            type="text"
            ref={toeShapeInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.toeShape}
          />

          <button
            onClick={() => {
              handleButtonClick("toeShape");
              toeShapeInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.toeShape && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.toeShapeList.map((item, index) => (
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
  const liningMaterialInputRef = useRef(null);
  const downshiftLiningMaterial = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            liningMaterial: selectedItem.name,
          });
          toggleSuggestVisibility("liningMaterial", false);
        }
      }}
      selectedItem={articleForm.liningMaterial}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "liningMaterial",
            })}
            type="text"
            ref={liningMaterialInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.liningMaterial}
          />

          <button
            onClick={() => {
              handleButtonClick("liningMaterial");
              liningMaterialInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.liningMaterial && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.liningMaterialList.map((item, index) => (
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

  const socksMaterialInputRef = useRef(null);
  const downshiftSocksMaterial = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            socksMaterial: selectedItem.name,
          });
          toggleSuggestVisibility("socksMaterial", false);
        }
      }}
      selectedItem={articleForm.socksMaterial}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "socksMaterial",
            })}
            type="text"
            ref={socksMaterialInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.socksMaterial}
          />

          <button
            onClick={() => {
              handleButtonClick("socksMaterial");
              socksMaterialInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.socksMaterial && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.socksMaterialList.map((item, index) => (
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
  const heelTypeInputRef = useRef(null);
  const downshiftHeelType = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            heelType: selectedItem.name,
          });
          toggleSuggestVisibility("heelType", false);
        }
      }}
      selectedItem={articleForm.heelType}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "heelType",
            })}
            type="text"
            ref={heelTypeInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.heelType}
          />

          <button
            onClick={() => {
              handleButtonClick("heelType");
              heelTypeInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.heelType && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.heelTypeList.map((item, index) => (
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

  const categoryInputRef = useRef(null);
  const downshiftCategory = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            category: selectedItem.name,
          });
          toggleSuggestVisibility("category", false);
        }
      }}
      selectedItem={articleForm.category}
      itemToString={(item) => (item ? item.name : "")}

    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleChange,
              name: "category",
            })}
            type="text"
            ref={categoryInputRef}
            className={styles.basicInput}
            placeholder="Insert First Letter"
            value={articleForm.category}
          />

          <button
            onClick={() => {
              handleButtonClick("category");
              categoryInputRef.current?.focus();
            }}
            className={styles.searchBtn}
            aria-label="dropDorn"
          ></button>

          {showSuggestions.category && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.categoryList.map((item, index) => (
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
    <div className={styles.articlePageContainer}>
      <div className={styles.articleDirectoryContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>Article Directory</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <div className={styles.subHeadContainerThree}>
              <h2>Article Details</h2>
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
            <label className={styles.sampleLabel} htmlFor="articleName">
              Article Name
            </label>
            <input
              type="text"
              className={styles.basicInput}
              name="articleName"
              placeholder="Enter Here"
              onChange={handleNormalArticleChange}
              value={articleForm.articleName}
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="color">
              Article Color
            </label>
            {downshiftColor}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="animal">
              Animal
            </label>
            {downshiftAnimal}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="gender">
              Gender
            </label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.selectInput}
                name="gender"
                onChange={handleNormalArticleChange}
                value={articleForm.gender}
              >
                <option value="" selected disabled hidden>
                  Select Gender
                </option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="soleType">
              Sole Type
            </label>
            {downshiftSoleType}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="toeShape">
              Toe Shape
            </label>
            {downshiftToeShape}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="category">
              Category
            </label>
            {downshiftCategory}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Platform No.
            </label>
            <input
              type="text"
              name="platformNo"
              className={styles.basicInput}
              placeholder="Enter Here"
              value={articleForm.platformNo}
              onChange={handleNormalArticleChange}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input4">
              Heel Type
            </label>
            {downshiftHeelType}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Heel Height
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
              name="heelHeight"
              value={articleForm.heelHeight}
              onChange={handleNormalArticleChange}
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input4">
              Last No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
              name="lastNo"
              value={articleForm.lastNo}
              onChange={handleNormalArticleChange}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Lining Material
            </label>
            {downshiftLiningMaterial}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Socks Material
            </label>
            {downshiftSocksMaterial}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Platform
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
              name="platformType"
              value={articleForm.platformType}
              onChange={handleNormalArticleChange}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Heel No.
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
              name="heelNo"
              value={articleForm.heelNo}
              onChange={handleNormalArticleChange}
            />
          </div>
         

          <div className={styles.largeColSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Comment
            </label>
            <textarea
              className={styles.basicInput2}
              placeholder="Enter Here"
              name="comment"
              value={articleForm.comment}
              onChange={handleNormalArticleChange}
              rows="3"
            ></textarea>
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
            <button
              className={styles.resetButton}
              onClick={() => resetArticle()}
            >
              Reset
            </button>
            <button
              className={styles.submitButton}
              onClick={handleSubmitArticleClick}
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
          itemForm={articleForm}
        />
      )}
    </div>
  );
};

export default ArticleDirectory;
