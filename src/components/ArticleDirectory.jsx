import React, { useState , useEffect} from "react";
import styles from "../styles/articleDirectory.module.css";
import { getApiService } from "../service/apiService";

const ArticleDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [colors, setColors] = useState([]);
  const [articleForm , setArticleForm] = useState({
    articlename:"",
    animal: "",
    soletype:"",
    toeshape:"",
    heeltype:"",
    shoetype:"",
    gender:"",
    color: "",
    socksmaterial:"",
    liningmaterial:"",
    skintype: "",


  })
  const [filteredList, setFilteredList] = useState({
    animalList: [],
    soletypeList:[],
    toeshapeList:[],
    shoetypeList:[],
    heeltypeList:[],
    skintypeList:[],
    liningmaterialList:[],
    socksmaterialList:[],
  });
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
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

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleForm({ ...articleForm, [name]: value });

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
    soletype:false,
    toeshape:false,
    heeltype:false,
    color: false,
    skintype: false,
  });

  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  return (
    <div className={styles.articlePageContainer}>
      <div className={styles.articleDirectoryContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>Article Directory</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <h2>Article Details</h2>
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
              placeholder="Enter Here"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="color">
              Article Color
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert Two Letter"
                value={articleForm.color}
                name="color"
                onChange={handleCreateColorChange}
              />
              {showSuggestions.color && (
                <div className={styles.suggestions}>
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          color: color,
                        });
                        toggleSuggestVisibility("color", false);
                      }}
                    >
                      {color}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="animal">
              Animal
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.animal}
                name="animal"
                onChange={handleArticleChange}
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
                        setArticleForm({
                          ...articleForm,
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
            <label className={styles.sampleLabel} htmlFor="input4">
              Gender
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} 
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
            <label className={styles.sampleLabel} htmlFor="input4">
              Sole Type
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.soletype}
                name="soletype"
                onChange={handleArticleChange}
              />
              <button
                onClick={() => handleButtonClick("soletype")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.soletype && (
                <div className={styles.suggestions}>
                  {filteredList.soletypeList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          soletype: item.name,
                        });
                        toggleSuggestVisibility("soletype", false);
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
            <label className={styles.sampleLabel} htmlFor="input4">
              Toe Shape
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.toeshape}
                name="toeshape"
                onChange={handleArticleChange}
              />
              <button
                onClick={() => handleButtonClick("toeshape")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.toeshape && (
                <div className={styles.suggestions}>
                  {filteredList.toeshapeList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          toeshape: item.name,
                        });
                        toggleSuggestVisibility("toeshape", false);
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
            <label className={styles.sampleLabel} htmlFor="input1">
              Shoe Type
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.shoetype}
                name="shoetype"
                onChange={handleArticleChange}
              />
              <button
                onClick={() => handleButtonClick("shoetype")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.shoetype && (
                <div className={styles.suggestions}>
                  {filteredList.shoetypeList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          shoetype: item.name,
                        });
                        toggleSuggestVisibility("shoetype", false);
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
            <label className={styles.sampleLabel} htmlFor="input4">
              Category
            </label>
            <div className={styles.selectWrapper}>
              <select className={styles.selectInput} name="category" required>
                <option value="" selected disabled hidden>
                  Select Category
                </option>
                <option value="Boot">Boot</option>
                <option value="Snekers">Snekers</option>
              </select>
            </div>
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Platform No.
            </label>
            <input
              type="text"
              name="platform"
              className={styles.basicInput}
              placeholder="Enter Here"
              onChange={handleNormalArticleChange}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input4">
              Heel Type
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.heeltype}
                name="heeltype"
                onChange={handleArticleChange}
              />
              <button
                onClick={() => handleButtonClick("heeltype")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.heeltype && (
                <div className={styles.suggestions}>
                  {filteredList.heeltypeList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          heeltype: item.name,
                        });
                        toggleSuggestVisibility("heeltype", false);
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
            <label className={styles.sampleLabel} htmlFor="input1">
              Heel Height
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
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
              onChange={handleNormalArticleChange}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Lining Material
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.liningmaterial}
                name="liningmaterial"
                onChange={handleArticleChange}
              />
              <button
                onClick={() => handleButtonClick("liningmaterial")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.liningmaterial && (
                <div className={styles.suggestions}>
                  {filteredList.liningmaterialList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          liningmaterial: item.name,
                        });
                        toggleSuggestVisibility("liningmaterial", false);
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
            <label className={styles.sampleLabel} htmlFor="input1">
              Socks Material
            </label>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Insert First Letter"
                value={articleForm.socksmaterial}
                name="socksmaterial"
                onChange={handleArticleChange}
              />
              <button
                onClick={() => handleButtonClick("socksmaterial")}
                className={styles.searchBtn}
                aria-label="dropDorn"
              ></button>
              {showSuggestions.socksmaterial && (
                <div className={styles.suggestions}>
                  {filteredList.socksmaterialList.map((item, index) => (
                    <div
                      key={index}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setArticleForm({
                          ...articleForm,
                          socksmaterial: item.name,
                        });
                        toggleSuggestVisibility("socksmaterial", false);
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
            <label className={styles.sampleLabel} htmlFor="input1">
              Platform
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
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
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Referance
            </label>
            <input
              type="text"
              className={styles.basicInput}
              placeholder="Enter Here"
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
              onChange={handleNormalArticleChange}
              rows="3"
            ></textarea>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.resetButton}>Reset</button>
          <button onClick={togglePopup} className={styles.submitButton}>
            Submit
          </button>
        </div>
      </div>
      {isPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2>New Article Added</h2>
            <button className={styles.popupButton} onClick={togglePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDirectory;
