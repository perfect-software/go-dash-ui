import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/bom.module.css";
import Downshift from "downshift";
import ReactDOM from "react-dom";
import { getApiService } from "../service/apiService";
import { generatePDF } from "../features/generateArticleCostPDF";
import MaterialTable from "./MaterialTable";
const BottomGrid = ({
  index,
  removeGrid,
  addGrid,
  articleCostForm,
  setArticleCostForm,
}) => {
  const [localItemNames, setLocalItemNames] = useState([]);
  const [showLocalSuggestions, setShowLocalSuggestions] = useState(false);

  const handleItemGridChange = (e, data) => {
    const { name, value } = e.target;
    const updatedItems = [...articleCostForm.items];
    updatedItems[index] = updatedItems[index] || {};
    updatedItems[index][data] = value;
    if (data === "quantity" || data === "rate") {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const rate = parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].cost = (quantity * rate).toFixed(2);
    }
    const totalCost = updatedItems.reduce(
      (total, item) => total + parseFloat(item.cost) || 0,
      0
    );

    setArticleCostForm((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalCost: totalCost.toFixed(2),
    }));
  };
  const handleItemNameChange = async (e) => {
    const { value } = e.target;
    const updatedItems = [...articleCostForm.items];
    updatedItems[index] = updatedItems[index] || {};
    updatedItems[index].itemName = value;
    setArticleCostForm({
      ...articleCostForm,
      items: updatedItems,
    });

    if (value.length >= 1) {
      const BASE_URL = `item/getItemName?input=${encodeURIComponent(value)}`;
      try {
        const fetchedItemName = await getApiService(BASE_URL);
        setLocalItemNames(fetchedItemName);
        setShowLocalSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch Item Names:", error);
      }
    } else {
      setShowLocalSuggestions(false);
    }
  };

  const downshiftItemName = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          const updatedItems = [...articleCostForm.items];
          updatedItems[index] = {
            ...updatedItems[index],
            itemName: selectedItem,
          };
          setArticleCostForm({
            ...articleCostForm,
            items: updatedItems,
          });

          setShowLocalSuggestions(false);
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={articleCostForm.items[index]?.itemName || ""}
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
            value={articleCostForm.items[index]?.itemName || ""}
          />
          <div {...getMenuProps()} className={styles.suggestions2}>
            {showLocalSuggestions &&
              localItemNames.map((name, idx) => (
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
    <tr>
      <td style={{ textAlign: "center" }}>
        {index !== 0 ? (
          <button
            className={styles.minus}
            onClick={() => removeGrid(index)}
          ></button>
        ) : (
          <button className={styles.plus} onClick={addGrid}></button>
        )}
      </td>
      <td>
        <label className={styles.sampleLabel2} htmlFor="itemName">
          Item Name
        </label>
        {downshiftItemName}
      </td>
      <td>
        <label className={styles.sampleLabel2} htmlFor="quantity">
          Quantity
        </label>
        <input
          onChange={(e) => handleItemGridChange(e, "quantity")}
          type="number"
          className={styles.basicInput}
          placeholder="Enter Quantity"
          value={articleCostForm.items[index]?.quantity || ""}
        />
      </td>
      <td>
        <label className={styles.sampleLabel2} htmlFor="rate">
          Rate
        </label>
        <input
          onChange={(e) => handleItemGridChange(e, "rate")}
          type="number"
          className={styles.basicInput}
          placeholder="Enter Rate"
          value={articleCostForm.items[index]?.rate || ""}
        />
      </td>
      <td>
        <label className={styles.sampleLabel2} htmlFor="cost">
          Cost
        </label>
        <input
          onChange={(e) => handleItemGridChange(e, "cost")}
          className={styles.basicInput}
          placeholder="Press Enter : Add table"
          readOnly
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addGrid();
            }
          }}
          value={articleCostForm.items[index]?.cost || ""}
        />
      </td>
    </tr>
  );
};

const Bom = () => {
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const containerRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [articleNos, setArticleNos] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [pdfContent, setPdfContent] = useState(null);

  const [articleCostForm, setArticleCostForm] = useState({
    buyerName: "",
    articleNo: "",
    items: [{ itemName: "", rate: "", quantity: "", cost: "" }],
    totalCost: "",
  });

  const [showSuggestions, setShowSuggestions] = useState({
    buyer: false,
    color: false,
    articleNo: false,
    itemName: false,
  });

  const addGrid = () => {
    setBottomGrids([...bottomGrids, {}]);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [bottomGrids]);

  const removeGrid = (index) => {
    const updatedGrids = bottomGrids.filter((_, idx) => idx !== index);
    setBottomGrids(updatedGrids);
  };

  const handleArticleCostingChange = (e) => {
    const { name, value } = e.target;
    setArticleCostForm({
      ...articleCostForm,
      [name]: value,
    });
  };

  const handleViewPDF = async () => {
    await generatePDF(articleCostForm);
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
  const downshiftBuyer = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleCostForm({
            ...articleCostForm,
            buyerName: selectedItem.bsName,
          });
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={articleCostForm.buyerName}
      itemToString={(item) => (item ? item.buyerName : "")}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleBuyerInputChange,
              name: "buyerName",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Click on Search"
            value={articleCostForm.buyerName}
          />
          <button
            // onClick={() => articleNoFetch()}
            className={styles.searchBtn}
            aria-label="Search"
          ></button>
          <div {...getMenuProps()} className={styles.suggestions}>
            {showSuggestions.buyer &&
              buyers.map((buyer, index) => (
                <div
                  {...getItemProps({ key: index, index, item: buyer })}
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
            {downshiftBuyer}
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
            readOnly
            value={articleCostForm.articleNo}
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
            readOnly
            value={articleCostForm.buyerName}
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
            readOnly
            value={articleCostForm.articleName}
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
            readOnly
            value={articleCostForm.color}
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
            readOnly
            value={articleCostForm.animal}
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
            readOnly
            value={articleCostForm.sole}
          />
          </div>
        </div>
        <div className={styles.middleContainerBottom}>
          <span>Add Group Here</span>
          <button className={styles.plus2} onClick={addGrid}></button>
        </div>
        <div className={styles.headBorder}></div>
       
        <div className={styles.materialTableContainer}>
        <MaterialTable
        />
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
              // onClick={handleSubmitArticleClick}
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
