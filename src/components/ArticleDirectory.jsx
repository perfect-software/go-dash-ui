import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/inputDetails.module.css";
import {
  getApiService,
  postApiService,
  putApiService,
} from "../service/apiService";
import Cross from "../assets/cross.svg";
import IButtonIcon from "../assets/iButton.svg";
import Downshift from "downshift";
import axios from "axios";
import Upload from "../assets/folder-upload.png";
import { fetchAllArticles } from "../reducer/articleSlice";
import { fetchAllArticleMst } from "../reducer/articleMstSlice";
import ArticleMstPopup from "../popups/ArticleMstPopup";
import { useDispatch, useSelector } from "react-redux";
import ItemHeadPopup from "../popups/ItemHeadPopup";
import { ARTICLE_IMAGE_PATH } from "../features/url";
import ViewArticle from "./ViewArticle";
import ViewArticleDetails from "./ViewArticleDetails";
import GenericDownshiftDropdown from "../features/genericDownshift";
import InfoPopup from "../popups/InfoPopup";
const ArticleDirectory = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [colors, setColors] = useState([]);
  const initialValidationState = {};
  const [isArticlePopup, setIsArticlePopup] = useState(false);
  const [validation, setValidation] = useState(initialValidationState);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [activeButton, setActiveButton] = useState("details");
  const [showInputLoading, setShowInputLoading] = useState({
    animal: false,
    articleNo: false,
    soleType: false,
    season: false,
    leather:false,
    insole:false,
    sole:false,
    subCategory:false,
    lastType:false,
    toeShape: false,
    heelHeight:false,
    category: false,
    heelType: false,
    color: false,
    liningMaterial: false,
    socksMaterial: false,
  });
  const [isInfoPopup, setIsInfoPopup] = useState(false);
  const [isItemHeadPopup, setIsItemHeadPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [articleSaved, setArticleSaved] = useState(false);
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
          articleNo: "",
          animal: "",
          color: "",
          gender: "",
          season:"",
          colorCode:"",
          leather:"",
          insole:"",
          sole:"",
          subCategory:"",
          soleType: "",
          lastType:"",
          toeShape: "",
          category: "",
          platformType: "",
          platformNo: "",
          username:"",
          heelType: "",
          heelNo: "",
          heelHeight: "",
          lastNo: "",
          liningMaterial: "",
          socksMaterial: "",
          comment: "",
        };
  });
  const { articleMst, articleLoaded, articleLoading, articleError } =
    useSelector((state) => state.articleMst);
  const validateForm = () => {
    let isValid = true;
    let newValidation = {};

    const requiredFields = [
      "articleName",
      "articleNo",
      "animal",
      "season",
      "colorCode",
      "color",
      "lastType",
      "gender",
       "leather",
       "sole",
       "insole",
       "subCategory",
      "soleType",
      "toeShape",
      "category",
      "platformType",
      "platformNo",
      "heelType",
      "heelNo",
      "heelHeight",
      "lastNo",
      "liningMaterial",
      "socksMaterial",
    ];

    requiredFields.forEach((field) => {
      if (!articleForm[field] || articleForm[field].trim() === "") {
        isValid = false;
        newValidation[field] = "invalid";
      } else {
        newValidation[field] = "valid";
      }
    });

    setValidation(newValidation);
    return isValid;
  };
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
    articleNoList: [],
    lastTypeList:[],
    soleList:[],
    subCategoryList:[],
    insoleList:[],
    leatherList:[],
    soleTypeList: [],
    toeShapeList: [],
    platformTypeList:[],
    heelTypeList: [],
    heelHeightList: [],
    seasonList: [],
    categoryList: [],
    liningMaterialList: [],
    socksMaterialList: [],
  });
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
    setArticleSaved(false);
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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
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

  const handleArticleUpdate = (article) => {
    if (Array.isArray(article) && article.length > 0) {
      const newArticle = article[0];
      setEditArticle(newArticle);
      setIsEditClicked(true);
      setActiveButton("details");
      if (newArticle) {
        const { imageNm, article_no, ...restOfArticle } = newArticle;
        setArticleForm({
          ...articleForm,
          articleNo: article_no,
          ...restOfArticle,
        });
        const articleImageUrl = imageNm
          ? `${ARTICLE_IMAGE_PATH}${imageNm}`
          : null;
        setImagePreview(articleImageUrl);
      } else {
        console.error("editArticle is null");
      }
    }
  };

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
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  useEffect(() => {
    if (itemsData.length === 0) {
      getItems();
    }
    if (!articleLoaded && !articleLoading) {
      dispatch(fetchAllArticleMst());
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
      el.style.cssText = "height:auto;";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }
  };
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.addEventListener("keydown", autosize);
    }
    return () => {
      if (el) {
        el.removeEventListener("keydown", autosize);
      }
    };
  }, []);
  const [showSuggestions, setShowSuggestions] = useState({
    animal: false,
    articleNo: false,
    soleType: false,
    season: false,
    leather:false,
    insole:false,
    sole:false,
    subCategory:false,
    lastType:false,
    platformType:false,
    toeShape: false,
    heelHeight:false,
    category: false,
    heelType: false,
    color: false,
    liningMaterial: false,
    socksMaterial: false,
  });
  const resetArticle = () => {
    setArticleForm({
      articleName: "",
          articleNo: "",
          animal: "",
          color: "",
          gender: "",
          leather:"",
          season:"",
          colorCode:"",
          insole:"",
          sole:"",
          subCategory:"",
          soleType: "",
          lastType:"",
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
    setImagePreview(null);
    setValidation(initialValidationState);
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
    formData.append("type", "article");

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
      if (response.data.responseStatus) {
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

  const handleUpdateArticleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    const formData = Object.entries(articleForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});
    const resName = formData.articleNo + "-" + formData.lastNo;
    const imageName = formData.articleName + "-" + formData.lastNo;
    const imageResponseData = await uploadImage(imageName);
    const imageNm = imageResponseData ? imageResponseData.response : null;
    const BASE_URL = "article/update";
    try {
      const updatedArticleForm = {
        ...formData,
        imageNm: imageNm,
        articleId: editArticle.articleId,
      };
      const responseData = await putApiService(updatedArticleForm, BASE_URL);
      if (
        responseData.responseStatus &&
        responseData.responseStatus.description
      ) {
        togglePopup(
          responseData.responseStatus.description + " For " + resName
        );
      }
      setArticleSaved(true);
      setIsEditClicked(false);
      dispatch(fetchAllArticles());
      dispatch(fetchAllArticleMst());
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

  const handleArticleMstChange = (e) => {
    const { name, value } = e.target;
    toggleInputLoaderVisibility(name, true);
    setArticleForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (value.trim().length > 0) {
      const concatenatedString = `${name}List`;
      const filtered = articleMst
        .filter((item) =>
          item.articleNo.includes(value.trim().toLowerCase())
        )
        .map((item) => ({
          article_no: item.articleNo,
          last_no: item.lastNo,
        }));

      setFilteredList((prevList) => ({
        ...prevList,
        [concatenatedString]: filtered,
      }));
      toggleSuggestVisibility(name, filtered.length > 0);
    } else {
      toggleSuggestVisibility(name, false);
      setFilteredList((prevList) => ({
        ...prevList,
        [`${name}List`]: [],
      }));
    }
    toggleInputLoaderVisibility(name, false);
    setValidation((prev) => ({ ...prev, [name]: "valid" }));
  };

  const handleArticleNoSubmit = (articleMst) => {
    if (Array.isArray(articleMst) && articleMst.length > 0) {
      const selectedArticle = articleMst[0];
      setArticleForm({
        ...articleForm,
        articleNo: selectedArticle.articleNo,
        lastNo: selectedArticle.lastNo,
      });
      if (selectedArticle.lastNo) {
        setValidation((prev) => ({ ...prev, lastNo: "valid" }));
      }
      setValidation((prev) => ({ ...prev, articleNo: "valid" }));
      toggleSuggestVisibility("articleNo", false);
      setIsArticlePopup(false);
    }
  };
  const handleSubmitArticleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formData = Object.entries(articleForm).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {});
    const imageName = formData.articleName + "-" + formData.lastNo;
    const resName = formData.articleNo + "-" + formData.lastNo;
    const imageResponseData = await uploadImage(imageName);
    const imageNm = imageResponseData ? imageResponseData.response : null;
    const BASE_URL = "article/create";
    try {
      const updatedArticleForm = {
        ...formData,
        imageNm: imageNm,
      };
      console.log(updatedArticleForm);
      const responseData = await postApiService(updatedArticleForm, BASE_URL);
      if (
        responseData.responseStatus &&
        responseData.responseStatus.description
      ) {
        togglePopup(
          responseData.responseStatus.description + " For " + resName
        );
      }

      setArticleSaved(true);
      dispatch(fetchAllArticles());
      dispatch(fetchAllArticleMst());
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



  const downshiftColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            color: selectedItem,
          });
          toggleSuggestVisibility("color", false);
          setValidation((prev) => ({ ...prev, color: "valid" }));
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
            style={
              validation.color === "invalid" ? { border: "2px solid red" } : {}
            }
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

  const downshiftArticle = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleForm({
            ...articleForm,
            articleNo: selectedItem.article_no,
            lastNo: selectedItem.last_no,
          });
          toggleSuggestVisibility("articleNo", false);
          if (selectedItem.last_no) {
            setValidation((prev) => ({ ...prev, lastNo: "valid" }));
          }
        }
      }}
      selectedItem={articleForm.articleNo}
      itemToString={(item) => (item ? item.articleNo : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleArticleMstChange,
              name: "articleNo",
            })}
            type="text"
            maxLength="10"
            style={
              validation.articleNo === "invalid"
                ? { border: "2px solid red" }
                : {}
            }
            className={styles.basicInput2}
            disabled={isEditClicked}
            placeholder="Type any word"
            value={articleForm.articleNo}
          />
          <div>
            <button
              disabled={isEditClicked}
              onClick={() => {
                setIsArticlePopup(true);
              }}
              className={styles.searchBtn}
              aria-label="Search"
            ></button>
          </div>

          {showSuggestions.articleNo && (
            <div {...getMenuProps()} className={styles.suggestions}>
              {filteredList.articleNoList.map((item, index) => (
                <div
                  {...getItemProps({ key: index, index, item })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {item.article_no}
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
          <h1 className={styles.headText}>
            {activeButton === "details"
              ? isEditClicked
                ? `Update Article: ${
                    isEditClicked &&
                    editArticle.article_no + "-" + editArticle.lastNo
                  }`
                : "Article Directory"
              : "Article Search"}
          </h1>

          {activeButton === "details" && (
                 <div>
                 <img
                   src={IButtonIcon}
                   onClick={() => {
                     setIsInfoPopup(true);
                   }}
                   className={styles.ibutton}
                   alt="iButton"
                 />
               </div>
              )} 
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
              <button
                className={`${styles.screenChangeButton} ${
                  activeButton === "viewDetails" ? styles.active : ""
                }`}
                onClick={() => setActiveButton("viewDetails")}
              >
                View Article Details
              </button>
            </div>
            {/* {activeButton === "view" && (
              <div className={styles.editContainer}>
                <button
                 disabled={!isEditSelected}
                  className={styles.headButton}
                  onClick={handleEditClick}
                >
                 Update
                </button>
              </div>
            )} */}
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>
      {activeButton === "details" && (
        <>
          <div className={styles.articleTopGrid}>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleNo">
                Article No
              </label>
              {downshiftArticle}
            </div>

            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="articleName">
                Article Name
              </label>
              <input
                type="text"
                className={styles.basicInput}
                name="articleName"
                placeholder="Enter Here"
                style={
                  validation.articleName === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                onChange={handleNormalArticleChange}
                value={articleForm.articleName}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input4">
                Last No.
              </label>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Enter Here"
                disabled={isEditClicked}
                style={
                  validation.lastNo === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                name="lastNo"
                value={articleForm.lastNo}
                onChange={handleNormalArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Last Type
              </label>
              <GenericDownshiftDropdown
                name="lastType"
                selectedItem={articleForm.lastType}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      lastType: selectedItem.name,
                    });
                    toggleSuggestVisibility("lastType", false);
                    setValidation((prev) => ({ ...prev, lastType: "valid" }));
                  }
                }}
                items={filteredList.lastTypeList}
                showInputLoading={showInputLoading.lastType}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.lastType}
                placeholder="Insert First Letter"
                validationState={validation.lastType}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="season">
                Season
              </label>
              <GenericDownshiftDropdown
                name="season"
                selectedItem={articleForm.season}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      season: selectedItem.name,
                    });
                    toggleSuggestVisibility("season", false);
                    setValidation((prev) => ({ ...prev, season: "valid" }));
                  }
                }}
                items={filteredList.seasonList}
                showInputLoading={showInputLoading.season}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.season}
                placeholder="Insert First Letter"
                validationState={validation.season}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="color">
                Article Color
              </label>
              {downshiftColor}
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Color Code
              </label>
              <input
                type="text"
                name="colorCode"
                className={styles.basicInput}
                style={
                  validation.colorCode === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                placeholder="Enter Here"
                value={articleForm.colorCode}
                onChange={handleNormalArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="gender">
                Gender
              </label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.selectInput}
                  name="gender"
                  onChange={handleNormalArticleChange}
                  value={articleForm.gender}
                  style={
                    validation.gender === "invalid"
                      ? { border: "2px solid red" }
                      : {}
                  }
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
              <label className={styles.impsampleLabel} htmlFor="animal">
                Animal
              </label>
              <GenericDownshiftDropdown
                name="animal"
                selectedItem={articleForm.animal}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      animal: selectedItem.name,
                    });
                    toggleSuggestVisibility("animal", false);
                    setValidation((prev) => ({ ...prev, animal: "valid" }));
                  }
                }}
                items={filteredList.animalList}
                showInputLoading={showInputLoading.animal}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.animal}
                placeholder="Insert First Letter"
                validationState={validation.animal}
                handleChange={handleArticleChange}
              />
            </div>
          
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Leather
              </label>
              <GenericDownshiftDropdown
                name="leather"
                selectedItem={articleForm.leather}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      leather: selectedItem.name,
                    });
                    toggleSuggestVisibility("leather", false);
                    setValidation((prev) => ({ ...prev, leather: "valid" }));
                  }
                }}
                items={filteredList.leatherList}
                showInputLoading={showInputLoading.leather}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.leather}
                placeholder="Insert First Letter"
                validationState={validation.leather}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Insole
              </label>
              <GenericDownshiftDropdown
                name="insole"
                selectedItem={articleForm.insole}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      insole: selectedItem.name,
                    });
                    toggleSuggestVisibility("insole", false);
                    setValidation((prev) => ({ ...prev, insole: "valid" }));
                  }
                }}
                items={filteredList.insoleList}
                showInputLoading={showInputLoading.insole}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.insole}
                placeholder="Insert First Letter"
                validationState={validation.insole}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Sole
              </label>
              <GenericDownshiftDropdown
                name="sole"
                selectedItem={articleForm.sole}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      sole: selectedItem.name,
                    });
                    toggleSuggestVisibility("sole", false);
                    setValidation((prev) => ({ ...prev, sole: "valid" }));
                  }
                }}
                items={filteredList.soleList}
                showInputLoading={showInputLoading.sole}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.sole}
                placeholder="Insert First Letter"
                validationState={validation.sole}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="soleType">
                Sole Type
              </label>
              <GenericDownshiftDropdown
                name="soleType"
                selectedItem={articleForm.soleType}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      soleType: selectedItem.name,
                    });
                    toggleSuggestVisibility("soleType", false);
                    setValidation((prev) => ({ ...prev, soleType: "valid" }));
                  }
                }}
                items={filteredList.soleTypeList}
                showInputLoading={showInputLoading.soleType}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.soleType}
                placeholder="Insert First Letter"
                validationState={validation.soleType}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="toeShape">
                Toe Shape
              </label>
              <GenericDownshiftDropdown
                name="toeShape"
                selectedItem={articleForm.toeShape}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      toeShape: selectedItem.name,
                    });
                    toggleSuggestVisibility("toeShape", false);
                    setValidation((prev) => ({ ...prev, toeShape: "valid" }));
                  }
                }}
                items={filteredList.toeShapeList}
                showInputLoading={showInputLoading.toeShape}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.toeShape}
                placeholder="Insert First Letter"
                validationState={validation.toeShape}
                handleChange={handleArticleChange}
              />
            </div>

            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="category">
                Category
              </label>
              <GenericDownshiftDropdown
                name="category"
                selectedItem={articleForm.category}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      category: selectedItem.name,
                    });
                    toggleSuggestVisibility("category", false);
                    setValidation((prev) => ({ ...prev, category: "valid" }));
                  }
                }}
                items={filteredList.categoryList}
                showInputLoading={showInputLoading.category}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.category}
                placeholder="Insert First Letter"
                validationState={validation.category}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Sub Category
              </label>
              <GenericDownshiftDropdown
                name="subCategory"
                selectedItem={articleForm.subCategory}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      subCategory: selectedItem.name,
                    });
                    toggleSuggestVisibility("subCategory", false);
                    setValidation((prev) => ({ ...prev, subCategory: "valid" }));
                  }
                }}
                items={filteredList.subCategoryList}
                showInputLoading={showInputLoading.subCategory}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.subCategory}
                placeholder="Insert First Letter"
                validationState={validation.subCategory}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Platform No.
              </label>
              <input
                type="text"
                name="platformNo"
                className={styles.basicInput}
                style={
                  validation.platformNo === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                placeholder="Enter Here"
                value={articleForm.platformNo}
                onChange={handleNormalArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Heel No.
              </label>
              <input
                type="text"
                className={styles.basicInput}
                placeholder="Enter Here"
                name="heelNo"
                style={
                  validation.heelNo === "invalid"
                    ? { border: "2px solid red" }
                    : {}
                }
                value={articleForm.heelNo}
                onChange={handleNormalArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Heel Height
              </label>
              <GenericDownshiftDropdown
                name="heelHeight"
                selectedItem={articleForm.heelHeight}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      heelHeight: selectedItem.name,
                    });
                    toggleSuggestVisibility("heelHeight", false);
                    setValidation((prev) => ({ ...prev, heelHeight: "valid" }));
                  }
                }}
                items={filteredList.heelHeightList}
                showInputLoading={showInputLoading.heelHeight}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.heelHeight}
                placeholder="Insert First Letter"
                validationState={validation.heelHeight}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input4">
                Heel Type
              </label>
              <GenericDownshiftDropdown
                name="heelType"
                selectedItem={articleForm.heelType}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      heelType: selectedItem.name,
                    });
                    toggleSuggestVisibility("heelType", false);
                    setValidation((prev) => ({ ...prev, heelType: "valid" }));
                  }
                }}
                items={filteredList.heelTypeList}
                showInputLoading={showInputLoading.heelType}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.heelType}
                placeholder="Insert First Letter"
                validationState={validation.heelType}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Lining Material
              </label>
              <GenericDownshiftDropdown
                name="liningMaterial"
                selectedItem={articleForm.liningMaterial}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      liningMaterial: selectedItem.name,
                    });
                    toggleSuggestVisibility("liningMaterial", false);
                    setValidation((prev) => ({ ...prev, liningMaterial: "valid" }));
                  }
                }}
                items={filteredList.liningMaterialList}
                showInputLoading={showInputLoading.liningMaterial}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.liningMaterial}
                placeholder="Insert First Letter"
                validationState={validation.liningMaterial}
                handleChange={handleArticleChange}
              />
            </div>

            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Socks Material
              </label>
              <GenericDownshiftDropdown
                name="socksMaterial"
                selectedItem={articleForm.socksMaterial}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      socksMaterial: selectedItem.name,
                    });
                    toggleSuggestVisibility("socksMaterial", false);
                    setValidation((prev) => ({ ...prev, socksMaterial: "valid" }));
                  }
                }}
                items={filteredList.socksMaterialList}
                showInputLoading={showInputLoading.socksMaterial}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.socksMaterial}
                placeholder="Insert First Letter"
                validationState={validation.socksMaterial}
                handleChange={handleArticleChange}
              />
            </div>
            <div className={styles.colSpan}>
              <label className={styles.impsampleLabel} htmlFor="input1">
                Platform Type
              </label>
              <GenericDownshiftDropdown
                name="platformType"
                selectedItem={articleForm.platformType}
                onChange={(selectedItem) => {
                  if (selectedItem) {
                    setArticleForm({
                      ...articleForm,
                      platformType: selectedItem.name,
                    });
                    toggleSuggestVisibility("platformType", false);
                    setValidation((prev) => ({ ...prev, platformType: "valid" }));
                  }
                }}
                items={filteredList.platformTypeList}
                showInputLoading={showInputLoading.platformType}
                handleButtonClick={handleButtonClick}
                showSuggestions={showSuggestions.platformType}
                placeholder="Insert First Letter"
                validationState={validation.platformType}
                handleChange={handleArticleChange}
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
                <button
                  className={styles.popupButton}
                  onClick={() => {
                    articleSaved && resetArticle();
                    togglePopup();
                  }}
                >
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
          {isInfoPopup && (
            <InfoPopup
              onCancel={() => {
                setIsInfoPopup(false);
              }}
              infoName={"Article"}
            />
          )}
          {isArticlePopup && (
            <ArticleMstPopup
              onCancel={() => {
                setIsArticlePopup(false);
              }}
              onSubmitArticleData={handleArticleNoSubmit}
            />
          )}
        </>
      )}
      {activeButton === "view" && (
        <ViewArticle updateArticle={handleArticleUpdate} />
      )}
      {activeButton === "viewDetails" && <ViewArticleDetails />}
    </div>
  );
};

export default ArticleDirectory;
