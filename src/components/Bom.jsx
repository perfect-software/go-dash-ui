import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/bom.module.css";
import Downshift from "downshift";
import ReactDOM from "react-dom";
import { getApiService, postApiService } from "../service/apiService";
import { generatePDF } from "../features/generateBomPDF";
import MaterialTable from "./MaterialTable";

const Bom = () => {
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const containerRef = useRef(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [colors, setColors] = useState([]);
  const [articleNos, setArticleNos] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [pdfContent, setPdfContent] = useState(null);

  const [bomData, setBomData] = useState({
    sampleNo: "",
    articleNo: "",
    buyerName: "",
    articleName: "",
    color: "",
    animal: "",
    sole: "",
    totalCost:"",
    groups: [],
  });
  const togglePopup = (message) => {
    setIsPopupVisible(!isPopupVisible);
    setPopupMessage(message);
  };

  const [showSuggestions, setShowSuggestions] = useState({
    buyer: false,
    color: false,
    articleNo: false,
    itemName: false,
  });

  const addGrid = () => {
    setBottomGrids([...bottomGrids, {}]);
  };

  const handleBomChange = (e) => {
    const { name, value } = e.target;
    setBomData({
      ...bomData,
      [name]: value,
    });
  };

  const handleViewPDF = async () => {
    const jsonData = JSON.stringify(bomData);
    console.log(jsonData);
    await generatePDF(bomData);
    
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

  const handleCreateColorChange = async (e) => {
    const { name, value } = e.target;
    setArticleCostForm({ ...articleCostForm, [name]: value });
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
  const toggleSuggestVisibility = (key, value) => {
    setShowSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [key]: value,
    }));
  };
  const handleBuyerInputChange = async (e) => {
    const value = e.target.value;
    setArticleCostForm({ ...articleCostForm, buyerName: value });

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

  const handleSubmitBomClick = async (e)=>{
    e.preventDefault();
    setLoading(true);
    const BASE_URL = 'bom/create';
    try {
       const responseData = await postApiService(bomData,BASE_URL);
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
  }


  return (
    <div className={styles.bomContainer}>
      <div className={styles.bomSubContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>BOM</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <div className={styles.subHeadContainerThree}>
              <h2>Sample Details</h2>
              <button className={styles.headButton} onClick={handleViewPDF}>
                Print
              </button>
            </div>
            <div className={styles.headBorder}></div>
          </div>
        </div>
        <div className={styles.topGrid}>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleName">
              Sample No
            </label>
            <input
              type="text"
              name="sampleNo"
              className={styles.basicInput}
              placeholder="Sample No"
              onChange={handleBomChange}
              value={bomData.sampleNo}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Article No
            </label>
            <input
              type="text"
              name="articleNo"
              className={styles.basicInput}
              placeholder="Article No"
              onChange={handleBomChange}
              value={bomData.articleNo}
            />
          </div>

          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Buyer Name
            </label>
            <input
              type="text"
              name="buyerName"
              className={styles.basicInput}
              placeholder="Buyer Name"
              onChange={handleBomChange}
              value={bomData.buyerName}
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Article Name
            </label>
            <input
              type="text"
              name="articleName"
              className={styles.basicInput}
              placeholder="Article Name"
              onChange={handleBomChange}
              value={bomData.articleName}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Color
            </label>
            <input
              type="text"
              name="color"
              className={styles.basicInput}
              placeholder="Color"
              onChange={handleBomChange}
              value={bomData.color}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Animal
            </label>
            <input
              type="text"
              name="animal"
              className={styles.basicInput}
              placeholder="Animal"
              onChange={handleBomChange}
              value={bomData.animal}
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Sole
            </label>
            <input
              type="text"
              name="sole"
              className={styles.basicInput}
              placeholder="Sole"
              onChange={handleBomChange}
              value={bomData.sole}
            />
          </div>
        </div>
        <div className={styles.middleContainerBottom}>
          <span>Add Group Here</span>
          <button className={styles.plus2} onClick={addGrid}></button>
        </div>
        <div className={styles.headBorder}></div>

        <div className={styles.materialTableContainer}>
          <MaterialTable bomData={bomData} setBomData={setBomData} />
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
               onClick={handleSubmitBomClick}
            >
              Submit
            </button>
          </div>
        )}
      </div>
      {isPopupVisible && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContent}>
            <h2></h2>
            <button className={styles.popupButton} onClick={togglePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bom;
