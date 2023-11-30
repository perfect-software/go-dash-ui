import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/sampleRequest.module.css";
import UpIcon from "../assets/up.svg";
import ArticlePopup from "../popups/ArticlePopup";
import { useNavigate } from "react-router-dom";
import Cross from "../assets/cross.svg";
import BuyerPopup from "../popups/BuyerPopup";
import ViewSr from "./ViewSr";
import SampleDirPopup from "../popups/SampleDirPopup";
import { getApiService, postApiService } from "../service/apiService";
import {
  formatDate,
  getCurrentYearLastTwoDigits,
} from "../features/convertDate";
import { useSidebar } from "../context/SidebarContext";
import Downshift from "downshift";
import generatePDF from "../features/generatePDF";

const SampleRequest = () => {
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [removeImage, setRemoveImage] = useState(false);
  const [sampleType, setSampleType] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({
    buyer: false,
    upperColor: false,
    liningColor: false,
    soleLabel: false,
    sampleRef: false,
    articleNo: false,
  });
  const [activeButton, setActiveButton] = useState("details");
  const [buyers, setBuyers] = useState([]);
  const { isCollapsed, toggleNavbar } = useSidebar();
  const [colors, setColors] = useState([]);
  const [sampleRefrences, setSampleRefrences] = useState([]);
  const [articleNos, setArticleNos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bsId, setBsID] = useState("");
  const [isImagePopup, setIsImagePopup] = useState(false);
  const [isArticlePopup, setIsArticlePopup] = useState(false);
  const [isBuyerPopup, setIsBuyerPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSampleDirPopup, setIsSampleDirPopup] = useState(false);

  const [sampleDetailsForm, setSampleDetailsForm] = useState({
    season: "",
    sampleRef: "",
    sampleType: "",
    bsName: "",
    deliveryAddress: "",
    articleNo: "",
    buyerArticle: "",
    size: "",
    quantity: "",
    pair: "",
    upperColor: "",
    liningColor: "",
    last: "",
    insole: "",
    soleLabel: "",
    socks: "",
    heel: "",
    pattern: "",
    buyerRef: "",
    inUpperLeather: "",
    inLining: "",
    inSocks: "",
    inQuantity: "",
    comments: "",
    deliveryDate: "",
    prodExDate: "",
  });

  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };

  const handleCreateSampleChange = (e) => {
    const { name, value } = e.target;
    setSampleDetailsForm({
      ...sampleDetailsForm,
      [name]: value,
    });
  };
  const areAllFieldsFilled = (form) => {
    const fieldsToExclude = [
      "comments",
      "season",
      "sampleRef",
      "articleNo",
      "buyerRef",
    ];
    return !Object.entries(form)
      .filter(([key]) => !fieldsToExclude.includes(key))
      .some(([, value]) => value === "");
  };
  const [isGridVisible, setIsGridVisible] = useState({
    basic: true,
    internal: true,
    delivery: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleBuyerInputChange = async (e) => {
    const value = e.target.value;
    setSampleDetailsForm({ ...sampleDetailsForm, bsName: value });

    if (value.length >= 3) {
      const BASE_URL = `sample/getBuyer?input=${encodeURIComponent(value)}`;

      try {
        const fetchedBuyers = await getApiService(BASE_URL);
        setBuyers(fetchedBuyers);
        toggleSuggestVisibility("buyer", true);
      } catch (error) {
        console.error("Failed to fetch buyers:", error);
      }
    } else {
      toggleSuggestVisibility("buyer", false);
    }
  };

  const handleViewPDF = async () => {
    generatePDF(sampleDetailsForm,imagePreview);
  };

  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setSampleDetailsForm({ ...sampleDetailsForm, [name]: value });
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

  const handleSampleRefChange = async (e) => {
    const value = e.target.value;
    setSampleDetailsForm({ ...sampleDetailsForm, sampleRef: value });

    const encodedBsId = encodeURIComponent(bsId);
    const encodedInput = encodeURIComponent(value);

    if (value.length >= 1) {
      const BASE_URL = `sample/getSRNO/{bsId}?input=${encodedInput}&bsId=${bsId}`;

      try {
        const fetchedRef = await getApiService(BASE_URL);
        setSampleRefrences(fetchedRef);

        toggleSuggestVisibility("sampleRef", true);
      } catch (error) {
        console.error("Failed to fetch SampleRefs:", error);
      }
    } else {
      toggleSuggestVisibility("sampleRef", false);
    }
  };

  const handleArticleNoSubmit = (selectedArticle)=>{
    if (selectedArticle) {
      setSampleDetailsForm({
        ...sampleDetailsForm,
        articleNo:selectedArticle
      });
      setIsArticlePopup(false);
    }
  }
  const handleBuyerSubmit = (selectedBuyer) => {
    if (selectedBuyer) {
      setBsID(selectedBuyer.bsId);
      setSampleDetailsForm({
        ...sampleDetailsForm,
        bsName: selectedBuyer.bsName,
        deliveryAddress: selectedBuyer.billingAddress,
      });
      toggleSuggestVisibility("buyer", false);
      setIsBuyerPopup(false);
    }
  };

  const handleSampleSubmit = (selectedSample) => {
    if (selectedSample) {
      setSampleDetailsForm({
        ...sampleDetailsForm,
        ...selectedSample,
        bsName: selectedSample.buyer.bsName,
        deliveryAddress: selectedSample.buyer.billingAddress,
        deliveryDate: formatDate(selectedSample.deliveryDate),
        prodExDate: formatDate(selectedSample.prodExDate),
      });
      setIsSampleDirPopup(false);
    }
  };

  const resetAllFields = () => {
    setSampleDetailsForm({
      season: "",
      sampleRef: "",
      sampleType: "",
      articleNo: "",
      buyerArticle: "",
      size: "",
      quantity: "",
      pair: "",
      bsName: "",
      deliveryAddress: "",
      upperColor: "",
      liningColor: "",
      last: "",
      insole: "",
      soleLabel: "",
      socks: "",
      heel: "",
      pattern: "",
      buyerRef: "",
      inUpperLeather: "",
      inLining: "",
      inSocks: "",
      inQuantity: "",
      comments: "",
      deliveryDate: "",
      prodExDate: "",
    });
  };

  const handleCreateSampleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const BASE_URL = "sample/create";
    try {
      const responseData = await postApiService(sampleDetailsForm, BASE_URL);
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

  const handleSampleType = async () => {
    const BASE_URL = "sample/getSampleType";
    try {
      const fetchedType = await getApiService(BASE_URL);
      setSampleType(fetchedType);
    } catch (error) {
      console.error("Failed to fetch Sample Type:", error);
    }
  };
  const handleFileChange = (event) => {
    setRemoveImage(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const articleNoFetch = async () => {
    articleNoRef.current?.focus();
    const BASE_URL = "article/getArticleNo";
    try {
      const fetchedArticle = await getApiService(BASE_URL);
      console.log(fetchedArticle);
      setArticleNos(fetchedArticle);
      toggleSuggestVisibility("articleNo", true);
    } catch (error) {
      console.error("Failed to Article No:", error);
    }
  };
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const toggleGridVisibility = (grid) => {
    setIsGridVisible((prevState) => ({
      ...prevState,
      [grid]: !prevState[grid],
    }));
  };
  const today = new Date();

  const formattedDate = today.toISOString().split("T")[0];

  // Suggestions here
  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            bsName: selectedItem.bsName,
            deliveryAddress: selectedItem.deliveryAddress,
          });
          setBsID(selectedItem.bsId);
          toggleSuggestVisibility("buyer", false);
        }
      }}
     
      selectedItem={sampleDetailsForm.bsName}
      itemToString={(item) => item ? item.bsName : ''}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleBuyerInputChange,
              name: "bsName",
            })}
            type="text"
            className={styles.basicInput2}
            placeholder="Click on Search"
            value={sampleDetailsForm.bsName}
          />
          <button
            onClick={() => setIsBuyerPopup(true)}
            className={styles.searchBtn}
            aria-label="Search"
          ></button>

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyer &&
              buyers.map((buyer, index) => (
                <div
                  {...getItemProps({ key: buyer.bsId, index, item: buyer })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {buyer.bsName}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftSampleRef = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            sampleRef: selectedItem,
          });
          toggleSuggestVisibility("sampleRef", false);
        }
      }}
      selectedItem={sampleDetailsForm.sampleRef}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleSampleRefChange,
              name: "sampleRef",
            })}
            type="text"
            className={styles.basicInput2}
            placeholder="Type any word"
            value={sampleDetailsForm.sampleRef}
          />
          <button className={styles.searchBtn} aria-label="Search"></button>

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.sampleRef &&
              sampleRefrences.map((sample, index) => (
                <div
                  {...getItemProps({ key: index, index, item: sample })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {sample}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  const downshiftUpperColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            upperColor: selectedItem,
          });
          toggleSuggestVisibility("upperColor", false);
        }
      }}
      selectedItem={sampleDetailsForm.upperColor}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "upperColor",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={sampleDetailsForm.upperColor}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.upperColor &&
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

  const downshiftLiningColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            liningColor: selectedItem,
          });
          toggleSuggestVisibility("liningColor", false);
        }
      }}
      selectedItem={sampleDetailsForm.liningColor}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "liningColor",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={sampleDetailsForm.liningColor}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.liningColor &&
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

  const downshiftSoleLabel = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            soleLabel: selectedItem,
          });
          toggleSuggestVisibility("soleLabel", false);
        }
      }}
      selectedItem={sampleDetailsForm.soleLabel}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateColorChange,
              name: "soleLabel",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Insert Two Letter"
            value={sampleDetailsForm.soleLabel}
          />
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.soleLabel &&
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
  const articleNoRef = useRef(null);
  const downshiftArticleNo = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setSampleDetailsForm({
            ...sampleDetailsForm,
            articleNo: selectedItem,
          });
          toggleSuggestVisibility("articleNo", false);
        }
      }}
      selectedItem={sampleDetailsForm.articleNo}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleCreateSampleChange,
              name: "articleNo",
            })}
            type="text"
            ref={articleNoRef}
            className={styles.basicInput2}
            placeholder="Type any word"
            value={sampleDetailsForm.articleNo}
          />
           <div>
             <button
            onClick={() => {
              setIsArticlePopup(true);
            }}
            className={styles.searchBtn}
            aria-label="Search"
          ></button>
          <button
            onClick={() => articleNoFetch()}
            className={styles.searchBtn2}
            aria-label="Search"
          ></button>
           </div>

          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.articleNo &&
              articleNos.map((article, index) => (
                <div
                  {...getItemProps({ key: index, index, item: article })}
                  className={
                    highlightedIndex === index
                      ? styles.highlighted
                      : styles.suggestionItem
                  }
                >
                  {article}
                </div>
              ))}
          </div>
        </div>
      )}
    </Downshift>
  );

  //

  return (
    <div className={styles.sampleRequestMainContainer}>
      <div className={styles.headContainer}>
        <div className={styles.subHeadContainer}>
          <h1
            className={styles.headText}
            style={
              activeButton === "view"
                ? { marginBottom: "11px", marginTop: "13px" }
                : {}
            }
          >
            {activeButton === "view"
              ? "Sample Request Search"
              : "Sample Request"}
          </h1>
          {activeButton === "details" && (
            <div className={styles.headInputContainer}>
              <label className={styles.inputLabel} htmlFor="Copyfrom">
                Copy from
              </label>
              <div className={styles.headInputWithIcon}>
                <input
                  type="text"
                  name="input1"
                  placeholder="Search Sample Request to duplicate"
                  className={styles.headInput}
                  readOnly
                />
                <button
                  onClick={() => {
                    setIsSampleDirPopup(true);
                  }}
                  className={styles.searchBtn}
                  aria-label="Search"
                ></button>
              </div>
            </div>
          )}
        </div>
        <div className={styles.subHeadContainerTwo}>
          {/* <h2>Sample Order Details</h2> */}
          <div className={styles.topButtons}>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "details" ? styles.active : ""
              }`}
              onClick={() => setActiveButton("details")}
            >
              Sample Order Details
            </button>
            <button
              className={`${styles.screenChangeButton} ${
                activeButton === "view" ? styles.active : ""
              }`}
              onClick={() => {
                setActiveButton("view");
                {
                  !isCollapsed && toggleNavbar();
                }
              }}
            >
              View SRs
            </button>
          </div>
          <div className={styles.headBorder}></div>
        </div>
      </div>

      {activeButton === "details" ? (
        <>
          <div className={styles.topContainer}>
            <div className={styles.topGrid}>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="season">
                  Season
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    name="season"
                    value={sampleDetailsForm.season}
                    onChange={handleCreateSampleChange}
                  >
                    <option value="" selected disabled hidden>
                      Select Season
                    </option>
                    <option value={`SS`}>SS</option>
                    <option value={`SW`}>SW</option>
                    <option value={`SS`}>SR</option>
                    <option value={`SW`}>SA</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan2}>
                <label className={styles.impsampleLabel} htmlFor="bsName">
                  Buyer Name
                </label>
                {downshiftBuyer}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="sampleRef">
                  Sample Ref.
                </label>
                {downshiftSampleRef}
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="sampleType">
                  Type of Sample
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    name="sampleType"
                    value={sampleDetailsForm.sampleType}
                    onChange={handleCreateSampleChange}
                    onClick={() => handleSampleType()}
                    required
                  >
                    <option value="" disabled hidden>
                      Select Type
                    </option>
                    {sampleType.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.imgColSpan}>
                <div className={styles.fileinputcontainer}>
                  {imagePreview && (
                    <div className={styles.imagepreview}>
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        onClick={() => setIsImagePopup(true)}
                      />
                    </div>
                  )}
                  {removeImage ? (
                    <div>
                      <button
                        style={{ backgroundColor: "#001314" }}
                        className={styles.filelabel}
                        onClick={() => {
                          setRemoveImage(false);
                          setImagePreview(null);
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="file" className={styles.filelabel}>
                      Insert Image
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
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerTop}
              onClick={() => toggleGridVisibility("basic")}
            >
              <span>Basic Details</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.basic ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              className={`${styles.middleGrid} ${
                isGridVisible.basic ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="articleNo">
                  Article No
                </label>
                {/* <div className={styles.inputWithIcon}>
                  <input
                    type="text"
                    placeholder="Click on Search"
                    className={styles.basicInput2}
                    name="articleNo"
                    value={sampleDetailsForm.articleNo}
                    onChange={handleCreateSampleChange}
                  />
                  <button
                    onClick={() => {
                      setIsArticlePopup(true);
                    }}
                    className={styles.searchBtn}
                    aria-label="Search"
                  ></button>
                </div> */}
                {downshiftArticleNo}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="buyerArticle">
                  Buyer <br /> Article
                </label>
                <input
                  type="text"
                  id="input3"
                  className={styles.basicInput}
                  placeholder="Input 3"
                  name="buyerArticle"
                  value={sampleDetailsForm.buyerArticle}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="buyerRef">
                  Buyer Ref.
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="buyerRef"
                  value={sampleDetailsForm.buyerRef}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="dateOfOrder">
                  Date Of Order
                </label>
                <input
                  type="date"
                  className={`${styles.basicInput} ${styles.dateInput}`}
                  readOnly
                  defaultValue={formattedDate}
                  style={{ backgroundColor: "#F7F7F7" }}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="size">
                  Size
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="size"
                  value={sampleDetailsForm.size}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="quantity">
                  Quantity
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="quantity"
                  value={sampleDetailsForm.quantity}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label
                  className={styles.impsampleLabel}
                  htmlFor="pair"
                  required
                >
                  Pair
                </label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.selectInput}
                    name="pair"
                    value={sampleDetailsForm.pair}
                    onChange={handleCreateSampleChange}
                  >
                    <option value="" selected disabled hidden>
                      Select Pair
                    </option>
                    <option value="L">L</option>
                    <option value="R">R</option>
                    <option value="B">B</option>
                  </select>
                </div>
              </div>

              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="upperColor">
                  Upper <br /> Colour
                </label>
                {downshiftUpperColor}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="liningColor">
                  Lining Colour
                </label>
                {downshiftLiningColor}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="last">
                  Last
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="last"
                  value={sampleDetailsForm.last}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="insole">
                  Insole
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="insole"
                  value={sampleDetailsForm.insole}
                  onChange={handleCreateSampleChange}
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="soleLabel">
                  Sole Label <br />& Colour
                </label>
                {downshiftSoleLabel}
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="socks">
                  Socks
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="socks"
                  value={sampleDetailsForm.socks}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="heel">
                  Heel
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="heel"
                  value={sampleDetailsForm.heel}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="pattern">
                  Pattern
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Input Here"
                  name="pattern"
                  value={sampleDetailsForm.pattern}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.headSmallBorder}></div>

          <div className={styles.middleContainer}>
            <div
              className={styles.middleContainerBottom}
              onClick={() => toggleGridVisibility("internal")}
            >
              <span>Internal Info Own</span>
              <img
                src={UpIcon} // Replace with the actual path to your icon
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.internal ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.secondMiddleGrid} ${
                isGridVisible.internal ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label
                  className={styles.impsampleLabel}
                  htmlFor="inUpperLeather"
                >
                  Upper <br /> Leather
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="inUpperLeather"
                  value={sampleDetailsForm.inUpperLeather}
                  onChange={handleCreateSampleChange}
                  placeholder="Enter.."
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="inLining">
                  Lining
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="inLining"
                  value={sampleDetailsForm.inLining}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="inSocks">
                  Socks
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="inSocks"
                  value={sampleDetailsForm.inSocks}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="quantity">
                  Qunatity
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  placeholder="Enter.."
                  name="inQuantity"
                  value={sampleDetailsForm.inQuantity}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan2}>
                <label className={styles.sampleLabel} htmlFor="commentLeather">
                  Comment
                </label>
                <input
                  type="text"
                  className={styles.basicInput}
                  name="comments"
                  value={sampleDetailsForm.comments}
                  onChange={handleCreateSampleChange}
                  placeholder="Enter.."
                />
              </div>
            </div>
          </div>
          <div className={styles.headSmallBorder}></div>

          <div className={styles.bottomContainer}>
            <div
              className={styles.insideBottomContainer}
              onClick={() => toggleGridVisibility("delivery")}
            >
              <span>Delivey Details</span>
              <img
                src={UpIcon}
                alt="Toggle Icon"
                className={`${styles.chervIcon} ${
                  isGridVisible.delivery ? "" : `${styles.chervRotate}`
                }`}
              />
            </div>
            <div
              id="detailsGrid"
              className={`${styles.bottomGrid} ${
                isGridVisible.delivery ? "" : styles.hide
              }`}
            >
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="deliveryDate">
                  Delivery Date
                </label>
                <input
                  type="date"
                  className={`${styles.basicInput} ${styles.dateInput}`}
                  name="deliveryDate"
                  value={sampleDetailsForm.deliveryDate}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.impsampleLabel} htmlFor="prodExDate">
                  Prod-Ex Date
                </label>
                <input
                  type="date"
                  className={`${styles.basicInput} ${styles.dateInput}`}
                  name="prodExDate"
                  value={sampleDetailsForm.prodExDate}
                  onChange={handleCreateSampleChange}
                  required
                />
              </div>
              <div className={styles.colSpan}>
                <label className={styles.sampleLabel} htmlFor="deliveryAddress">
                  Delivery Address
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  className={styles.basicInput}
                  value={sampleDetailsForm.deliveryAddress}
                  onChange={handleCreateSampleChange}
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
                <button className={styles.resetButton} onClick={resetAllFields}>
                  Reset
                </button>
                <button
                  onClick={handleCreateSampleSubmit}
                  className={styles.submitButton}
                  disabled={!areAllFieldsFilled(sampleDetailsForm)}
                >
                  Submit
                </button>
                <button className={styles.resetButton} onClick={handleViewPDF}>
                  Print
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

          {isArticlePopup && (
            <ArticlePopup
              onCancel={() => {
                setIsArticlePopup(false);
              }}
              onSubmitArticleData={handleArticleNoSubmit}
            />
          )}
          {isBuyerPopup && (
            <BuyerPopup
              onCancel={() => {
                setIsBuyerPopup(false);
              }}
              onSubmitBuyerData={handleBuyerSubmit}
            />
          )}
          {isSampleDirPopup && (
            <SampleDirPopup
              onCancel={() => {
                setIsSampleDirPopup(false);
              }}
              onSubmitSampleData={handleSampleSubmit}
            />
          )}
        </>
      ) : (
        <ViewSr />
      )}
    </div>
  );
};

export default SampleRequest;
