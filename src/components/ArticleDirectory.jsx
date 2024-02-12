import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import { getApiService, postApiService } from "../service/apiService";
import Cross from "../assets/cross.svg";
import Downshift from "downshift";
import axios from "axios";
import Upload from "../assets/folder-upload.png";
import { fetchAllArticles } from "../reducer/articleSlice";
import { useDispatch, useSelector } from "react-redux";
import ItemHeadPopup from "../popups/ItemHeadPopup";
import ViewArticle from "./viewArticle";
import { ARTICLE_IMAGE_PATH } from "../features/url";
const ArticleDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [colors, setColors] = useState([]);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [showInputLoading, setShowInputLoading] = useState({
    animal: false,
    soleType: false,
    toeShape: false,
    category: false,
    heelType: false,
    color: false,
    liningMaterial: false,
    socksMaterial: false,
  });
  const [isItemHeadPopup, setIsItemHeadPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isEditSelected, setIsEditSelected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  const [editArticle, setEditArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
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
          username:"",
          heelHeight: "",
          lastNo: "",
          liningMaterial: "",
          socksMaterial: "",
          comment: "",
        };
  });
  useEffect(() => {
    const toggleActiveButton = (event) => {
      if (event.code === "ControlRight") {
        setActiveButton((prevButton) =>
          prevButton === "details" ? "providedDetails" : "details"
        );

      }
    };
    window.addEventListener("keydown", toggleActiveButton);
    return () => {
      window.removeEventListener("keydown", toggleActiveButton);
    };
  }, [activeButton]);
  useEffect(() => {
    localStorage.setItem("articleForm", JSON.stringify(articleForm));
  }, [articleForm]);
  const [filteredList, setFilteredList] = useState({
    animalList: [],
    soleTypeList: [],
    toeShapeList: [],
    heelTypeList: [],
    categoryList: [],
    liningMaterialList: [],
    socksMaterialList: [],
  });
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };
  const toggleInputLoaderVisibility = (key, value) => {
    setShowInputLoading((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
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
      } finally {
        toggleInputLoaderVisibility(`${name}`, false);
      }
    } else {
      toggleSuggestVisibility(`${name}`, false);
    }
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
const handleArticleEdit =(article)=>{
 setIsEditSelected(false);
 if(article) {
  setIsEditSelected(true);
   setEditArticle(article);
  
 }
}

const handleEditClick =()=>{
  setIsEditClicked(true);
  setActiveButton("details");
  const { image_nm , ...restOfArticle} = editArticle;
  setArticleForm({
    ...articleForm,
    ...restOfArticle,
  });
  setImagePreview(`${ARTICLE_IMAGE_PATH}${image_nm}`);
 }

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(`${name}`, true);
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
    toggleInputLoaderVisibility(`${name}`, false);
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
  const autosize = () => {
    const el = textareaRef.current;
    if (el) {
      
      el.style.cssText = 'height:auto;'; 
      el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }
  };
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.addEventListener('keydown', autosize);
    }
    return () => {
      if (el) {
        el.removeEventListener('keydown', autosize);
      }
    };
  }, []);
  const [showSuggestions, setShowSuggestions] = useState({
    animal: false,
    soleType: false,
    toeShape: false,
    category: false,
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
      username:"",
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
    setImagePreview(null);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        togglePopup("Please upload an image less than 1 MB.");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (name) => {
    if (!imageFile) {
      console.log("No image file selected for upload");
      return null;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("fileName", name);
    formData.append("type", 'article');

    try {
      const response = await axios.post(
        "http://localhost:8081/api/generic/upload",
        formData,
        {

          headers: {
            "Content-Type": "multipart/form-data ",
          },
        }
      );
      console.log("Image uploaded successfully:", response.data);
      return response.data;
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
      return null;
    }
  };


  const handleUpdateArticleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    const formData = Object.entries(articleForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});
    const imageName = formData.articleName+'-'+formData.lastNo;
    const imageResponseData = await uploadImage(imageName);
    const BASE_URL = "article/update";
    try {
      const updatedArticleForm = {
        ...formData,
        image_nm: imageResponseData.response,  
        articleId: editArticle.articleId,
      };
    const responseData = await postApiService(updatedArticleForm, BASE_URL);
    if (responseData.responseStatus && responseData.responseStatus.description) {
      togglePopup(
        responseData.responseStatus.description + " For " + responseData.response);
    }
    resetArticle(); 
    dispatch(fetchAllArticles());
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
    setLoading(false);
  }

  }

  const handleSubmitArticleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = Object.entries(articleForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});
    const imageName = formData.articleName+'-'+formData.lastNo;
    const imageResponseData = await uploadImage(imageName);
    const BASE_URL = "article/create";
    try {
        const updatedArticleForm = {
          ...formData,
          image_nm: imageResponseData.response,
        };
      const responseData = await postApiService(updatedArticleForm, BASE_URL);
      if (responseData.responseStatus && responseData.responseStatus.description) {
        togglePopup(
          responseData.responseStatus.description + " For " + responseData.response);
      }
 
      resetArticle();
      dispatch(fetchAllArticles());
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
            className={styles.buttonBasicInput}
            placeholder="Type "
            value={articleForm.color}
          />
          {showInputLoading.color && <div className={styles.dropLoader}></div>}
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
          {showInputLoading.soleType ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("soleType");
                soleTypeInputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

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
          {showInputLoading.toeShape ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("toeShape");
                toeShapeInputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

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
          {showInputLoading.liningMaterial ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("liningMaterial");
                liningMaterialInputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

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
          {showInputLoading.socksMaterial ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("socksMaterial");
                socksMaterialInputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

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
          {showInputLoading.heelType ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("heelType");
                heelTypeInputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

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
          {showInputLoading.category ? (
            <div className={styles.dropLoader}></div>
          ) : (
            <button
              onClick={() => {
                handleButtonClick("category");
                categoryInputRef.current?.focus();
              }}
              className={styles.dropBtn}
              aria-label="dropDorn"
            ></button>
          )}

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
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
        <h1
            className={styles.headText}
          >
            {activeButton === "details"
              ? isEditClicked
                ? `Update Article: ${
                    isEditClicked && editArticle.articleName && editArticle.articleName
                  }`
                : "Article Directory"
              : "Article Search"}
          </h1>
        </div>
        <div className={styles.subHeadContainerTwo}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Article Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "view" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("view")}
            >
              View Article
            </button>
          </div>
          {activeButton === "view" && (
              <div className={styles.editContainer}>
                <button
                 disabled={!isEditSelected}
                  className={styles.headButton}
                  onClick={handleEditClick}
                >
                 Update
                </button>
              </div>
            )}
           </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>
      {activeButton === "details" ? (
        <>
        <div className={styles.articleTopGrid}>
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
                <option value="M">Male</option>
                <option value="F">Female</option>
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
              Platform Type
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
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="username">
              Username
            </label>
            <input
              type="text"
              className={styles.basicInput}
              name="username"
              placeholder="Enter Here"
              onChange={handleNormalArticleChange}
              value={articleForm.username}
            />
          </div>
          <div className={styles.largeColSpan}>
            <label className={styles.sampleLabel} htmlFor="input1">
              Comment
            </label>
            <textarea
              ref={textareaRef}
              className={styles.commentInput}
              placeholder="Enter Here"
              name="comment"
              value={articleForm.comment}
              onChange={handleNormalArticleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className={styles.imgColSpan}>
                <div className={styles.fileinputcontainer2}>
                  {imagePreview ? (
                    <div className={styles.imagepreview2}>
                      <img
                        src={imagePreview}
                        onClick={() => setIsImagePopup(true)}
                        alt="Preview"
                      />
                      <img
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        src={Cross}
                        alt="Select Icon"
                        className={styles.removeImageButton2}
                      />
                    </div>
                  ) : (
                    <label htmlFor="file" className={styles.filelabel2}>
                      <img
                        src={Upload}
                        alt="Image Placeholder"
                        className={styles.uploadImagePlaceholder}
                      />
                        Upload Image
                        <input
                          type="file"
                          id="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                  )}
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
                {isEditClicked ? (
                  <>
                    <button
                      onClick={handleUpdateArticleSubmit}
                      className={styles.submitButton}
                    >
                      Submit
                    </button>{" "}
                    <button
                      className={styles.resetButton}
                      onClick={() => {
                        resetArticle();
                        setIsEditClicked(false);
                        setIsEditSelected(false);
                        setEditArticle(null);
                      }}
                    >
                      Go Back
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={styles.resetButton}
                      onClick={resetArticle}
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSubmitArticleClick}
                      className={styles.submitButton}
                    >
                      Submit
                    </button>
                  </>
                )}
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
       {isImagePopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.imagePopupContent}>
                <img
                  src={imagePreview}
                  className={styles.imagepreviewPopup}
                  alt=""
                />
                <img
                  onClick={() => {
                    setIsImagePopup(false);
                  }}
                  src={Cross}
                  alt="Select Icon"
                  className={styles.crossIcon}
                />
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
      </>
      ) : (
        <ViewArticle onArticleSelect={handleArticleEdit}/>
      )}
    </div>
  );
};

export default ArticleDirectory;
