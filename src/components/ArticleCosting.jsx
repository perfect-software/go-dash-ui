import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/articleCosting.module.css";
import Downshift from "downshift";
import { getApiService } from "../service/apiService";

const BottomGrid = ({ index, removeGrid , addGrid }) => {
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
        <input
          type="text"
          className={styles.basicInput}
          placeholder="Enter Item Name"
        />
      </td>
      <td>
        <input
          type="text"
          className={styles.basicInput}
          placeholder="Enter Quantity"
        />
      </td>
      <td>
        <input
          type="text"
          className={styles.basicInput}
          placeholder="Enter Finish"
        />
      </td>
      <td>
        <input
          type="text"
          className={styles.basicInput}
          placeholder="Enter Finish"
        />
      </td>
    </tr>
  );
};

const ArticleCosting = () => {
  const [loading, setLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [bottomGrids, setBottomGrids] = useState([{}]);
  const containerRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [articleNos , setArticleNos]  = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [articleCostForm, setArticleCostForm] = useState({
    buyerName: "",
    color: "",
    articleNo: "",
    size: "",
    leather: "",
    socks: "",
    lining: "",
    last: "",
    remark: "",
    sole: "",
    heel: "",
  });

  const [showSuggestions, setShowSuggestions] = useState({
    buyer: false,
    color: false,
    articleNo:false,
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
  const articleNoFetch = async ()=>{
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
  }
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
    setArticleCostForm({ ...articleCostForm, bsName: value });

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
            bsName: selectedItem.bsName,
          });
          toggleSuggestVisibility("buyer", false);
        }
      }}
      selectedItem={articleCostForm.bsName}
    >
      {({ getInputProps, getItemProps, getMenuProps, highlightedIndex }) => (
        <div className={styles.inputWithIcon}>
          <input
            {...getInputProps({
              onChange: handleBuyerInputChange,
              name: "bsName",
            })}
            type="text"
            className={styles.basicInput}
            placeholder="Click on Search"
            value={articleCostForm.bsName}
          />
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

  const downshiftColor = (
    <Downshift
      onChange={(selectedItem) => {
        if (selectedItem) {
          setArticleCostForm({
            ...articleCostForm,
            color: selectedItem,
          });
          toggleSuggestVisibility("color", false);
        }
      }}
      itemToString={(item) => (item ? item : "")}
      selectedItem={articleCostForm.color}
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
            value={articleCostForm.color}
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

  const articleNoRef = useRef(null);
  const downshiftArticleNo = (
    <Downshift
    onChange={(selectedItem) => {
      if (selectedItem) {
        setArticleCostForm({
          ...articleCostForm,
          articleNo:selectedItem
        });
        toggleSuggestVisibility("articleNo", false);
      }
    }}
    
    selectedItem={articleCostForm.articleNo}
  >
    {({
      getInputProps,
      getItemProps,
      getMenuProps,
      highlightedIndex,
    }) => (
      <div className={styles.inputWithIcon}>
       <input
        {...getInputProps({
          onChange: handleArticleCostingChange,
          name: "articleNo", 
        })}
        type="text"
        ref={articleNoRef}
        className={styles.basicInput}
        placeholder="Type any word"
        value={articleCostForm.articleNo}
        />
        <button
          onClick={()=>articleNoFetch()}
          className={styles.searchBtn}
          aria-label="Search"
        ></button>
  
        <div {...getMenuProps()} className={styles.suggestions}>
          {
            showSuggestions.articleNo &&
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
  return (
    <div className={styles.articleCostingContainer}>
      <div className={styles.articleSubCostingContainer}>
        <div className={styles.headContiner}>
          <div className={styles.subHeadContainer}>
            <h1 className={styles.headText}>Article Costing</h1>
          </div>
          <div className={styles.subHeadContainerTwo}>
            <h2>Article Details</h2>
            <div className={styles.headBorder}></div>
          </div>
        </div>
        <div className={styles.topGrid}>
          <div className={styles.colSpan2}>
            <label className={styles.sampleLabel} htmlFor="articleName">
              Buyer Name
            </label>
            {downshiftBuyer}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleName">
              Color
            </label>
            {downshiftColor}
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="articleNo">
              Article No.
            </label>
             {downshiftArticleNo}
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="size">
              Size
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.size}
              name="size"
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="leather">
              Leather
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.leather}
              name="leather"
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="socks">
              Socks
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.socks}
              name="socks"
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="lining">
              Lining
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.lining}
              name="lining"
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="last">
              Last
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.last}
              name="last"
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="remark">
              Remark
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.remark}
              name="remark"
              placeholder="Enter Here"
            />
          </div>
          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="sole">
              Sole
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.sole}
              name="sole"
              placeholder="Enter Here"
            />
          </div>

          <div className={styles.colSpan}>
            <label className={styles.sampleLabel} htmlFor="heel">
              Heel
            </label>
            <input
              type="text"
              className={styles.basicInput}
              value={articleCostForm.heel}
              name="heel"
              placeholder="Enter Here"
            />
          </div>
        </div>
        <div className={styles.middleContainerBottom}>
          <span>Add Items Here</span>
          <button className={styles.plus} onClick={addGrid}></button>
        </div>
        <div className={styles.headBorder}></div>
        <div className={styles.itemHeadContainer} ref={containerRef}>
          <table className={styles.customTable}>
            <thead>
              <tr>
                <th>Action</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {bottomGrids.map((_, index) => (
                <BottomGrid key={index} index={index} removeGrid={removeGrid} addGrid={addGrid} />
              ))}
            </tbody>
          </table>
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

export default ArticleCosting;
